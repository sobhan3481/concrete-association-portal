using System.Security.Cryptography;
using System.Text;
using ConcreteAssociation.Application.Abstractions;
using ConcreteAssociation.Application.Auth;
using ConcreteAssociation.Application.Common;
using ConcreteAssociation.Domain.Entities;
using ConcreteAssociation.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ConcreteAssociation.Infrastructure.Services;

public class AuthService(
    IApplicationDbContext db,
    IMobileNumberService mobileService,
    IOtpSender otpSender,
    IPasswordHasher passwordHasher,
    ITokenService tokenService,
    IAuditLogger auditLogger) : IAuthService
{
    private const int OtpExpirationMinutes = 2;
    private const int OtpResendSeconds = 60;
    private const int MaxOtpAttempts = 5;

    public async Task<Result<bool>> RequestOtpAsync(RequestOtpRequest request, string? ipAddress, CancellationToken cancellationToken)
    {
        if (!mobileService.IsValid(request.MobileNumber))
        {
            return Result<bool>.Failure("شماره موبایل معتبر نیست.");
        }

        var mobile = mobileService.Normalize(request.MobileNumber);
        var recentRequest = await db.OtpRequests
            .Where(x => x.MobileNumber == mobile)
            .OrderByDescending(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (recentRequest is not null && recentRequest.CreatedAtUtc > DateTime.UtcNow.AddSeconds(-OtpResendSeconds))
        {
            return Result<bool>.Failure("درخواست بیش از حد مجاز است. لطفاً کمی بعد تلاش کنید.");
        }

        var code = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
        var otp = new OtpRequest
        {
            MobileNumber = mobile,
            OtpHash = HashOtp(code),
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(OtpExpirationMinutes),
            MaxAttempts = MaxOtpAttempts,
            AttemptCount = 0,
            IsVerified = false
        };

        db.OtpRequests.Add(otp);
        await db.SaveChangesAsync(cancellationToken);
        await otpSender.SendAsync(mobile, code, cancellationToken);
        await auditLogger.LogAsync("OTP_REQUESTED", mobile, new { mobile }, null, ipAddress, cancellationToken);

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> VerifyOtpAsync(VerifyOtpRequest request, string? ipAddress, CancellationToken cancellationToken)
    {
        var mobile = mobileService.Normalize(request.MobileNumber);
        var otp = await db.OtpRequests
            .Where(x => x.MobileNumber == mobile && !x.IsVerified)
            .OrderByDescending(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (otp is null || otp.ExpiresAtUtc < DateTime.UtcNow)
        {
            return Result<bool>.Failure("کد تأیید منقضی شده است.");
        }

        if (otp.AttemptCount >= otp.MaxAttempts)
        {
            return Result<bool>.Failure("تعداد تلاش بیش از حد مجاز است.");
        }

        otp.AttemptCount += 1;
        var hash = HashOtp(request.Code);
        if (!string.Equals(hash, otp.OtpHash, StringComparison.Ordinal))
        {
            await db.SaveChangesAsync(cancellationToken);
            return Result<bool>.Failure("کد تأیید نادرست است.");
        }

        otp.IsVerified = true;
        otp.VerifiedAtUtc = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
        await auditLogger.LogAsync("OTP_VERIFIED", mobile, new { mobile }, null, ipAddress, cancellationToken);
        return Result<bool>.Success(true);
    }

    public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, string? ipAddress, CancellationToken cancellationToken)
    {
        var mobile = mobileService.Normalize(request.MobileNumber);
        var verifiedOtp = await db.OtpRequests
            .Where(x => x.MobileNumber == mobile && x.IsVerified)
            .OrderByDescending(x => x.VerifiedAtUtc)
            .FirstOrDefaultAsync(cancellationToken);

        if (verifiedOtp?.VerifiedAtUtc is null || verifiedOtp.VerifiedAtUtc < DateTime.UtcNow.AddMinutes(-15))
        {
            return Result<AuthResponse>.Failure("ابتدا شماره موبایل را تأیید کنید.");
        }

        if (await db.Users.AnyAsync(x => x.MobileNumber == mobile, cancellationToken))
        {
            return Result<AuthResponse>.Failure("این شماره قبلاً ثبت شده است.");
        }

        var username = await GenerateUsernameAsync(cancellationToken);
        var user = new User
        {
            FullName = request.FullName.Trim(),
            MobileNumber = mobile,
            PasswordHash = passwordHasher.Hash(request.Password),
            Username = username,
            IsMobileVerified = true
        };

        var memberRole = await db.Roles.FirstAsync(x => x.Name == SystemRole.Member, cancellationToken);
        db.Users.Add(user);
        db.UserRoles.Add(new UserRole { User = user, RoleId = memberRole.Id });

        var auth = tokenService.CreateAuthResponse(user, [SystemRole.Member]);
        db.RefreshTokens.Add(new RefreshToken
        {
            User = user,
            TokenHash = tokenService.HashToken(auth.RefreshToken),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7)
        });

        await db.SaveChangesAsync(cancellationToken);
        await auditLogger.LogAsync("USER_REGISTERED", user.MobileNumber, new { user.Id, user.Username }, user.Id, ipAddress, cancellationToken);
        return Result<AuthResponse>.Success(auth);
    }

    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request, string? ipAddress, CancellationToken cancellationToken)
    {
        var login = request.Login.Trim();
        var normalizedMobile = mobileService.Normalize(login);

        var user = await db.Users
            .Include(x => x.UserRoles)
            .ThenInclude(x => x.Role)
            .FirstOrDefaultAsync(x => x.MobileNumber == normalizedMobile || x.Username == login, cancellationToken);

        if (user is null || !passwordHasher.Verify(user.PasswordHash, request.Password))
        {
            await auditLogger.LogAsync("LOGIN_FAILURE", login, new { login }, null, ipAddress, cancellationToken);
            return Result<AuthResponse>.Failure("نام کاربری/رمز عبور نادرست است.");
        }

        var roles = user.UserRoles.Select(x => x.Role!.Name).ToList();
        var auth = tokenService.CreateAuthResponse(user, roles);
        db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = tokenService.HashToken(auth.RefreshToken),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7)
        });

        await db.SaveChangesAsync(cancellationToken);
        await auditLogger.LogAsync("LOGIN_SUCCESS", login, new { user.Id, user.Username }, user.Id, ipAddress, cancellationToken);
        return Result<AuthResponse>.Success(auth);
    }

    public async Task<Result<UserProfileResponse>> GetProfileAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await db.Users.Include(x => x.UserRoles).ThenInclude(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == userId, cancellationToken);

        if (user is null)
        {
            return Result<UserProfileResponse>.Failure("کاربر یافت نشد.");
        }

        var response = new UserProfileResponse(user.Id, user.Username, user.FullName, user.MobileNumber,
            user.UserRoles.Select(x => x.Role!.Name).ToList());

        return Result<UserProfileResponse>.Success(response);
    }

    private async Task<string> GenerateUsernameAsync(CancellationToken cancellationToken)
    {
        var prefix = "ca";
        for (var i = 0; i < 10; i++)
        {
            var candidate = $"{prefix}{RandomNumberGenerator.GetInt32(100000, 999999)}";
            if (!await db.Users.AnyAsync(x => x.Username == candidate, cancellationToken))
            {
                return candidate;
            }
        }

        return $"{prefix}{Guid.NewGuid():N}"[..14];
    }

    private static string HashOtp(string code)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(code));
        return Convert.ToHexString(bytes);
    }
}
