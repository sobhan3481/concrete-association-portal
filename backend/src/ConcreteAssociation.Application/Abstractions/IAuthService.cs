using ConcreteAssociation.Application.Auth;
using ConcreteAssociation.Application.Common;

namespace ConcreteAssociation.Application.Abstractions;

public interface IAuthService
{
    Task<Result<bool>> RequestOtpAsync(RequestOtpRequest request, string? ipAddress, CancellationToken cancellationToken);
    Task<Result<bool>> VerifyOtpAsync(VerifyOtpRequest request, string? ipAddress, CancellationToken cancellationToken);
    Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, string? ipAddress, CancellationToken cancellationToken);
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request, string? ipAddress, CancellationToken cancellationToken);
    Task<Result<UserProfileResponse>> GetProfileAsync(Guid userId, CancellationToken cancellationToken);
}
