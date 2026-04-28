using System.ComponentModel.DataAnnotations;

namespace ConcreteAssociation.Application.Auth;

public record RequestOtpRequest([Required] string MobileNumber);
public record VerifyOtpRequest([Required] string MobileNumber, [Required, StringLength(6, MinimumLength = 4)] string Code);
public record RegisterRequest([Required] string MobileNumber, [Required] string FullName, [Required, MinLength(8)] string Password);
public record LoginRequest([Required] string Login, [Required] string Password);
public record AuthResponse(string AccessToken, string RefreshToken, DateTime ExpiresAtUtc, UserProfileResponse User);
public record UserProfileResponse(Guid Id, string Username, string FullName, string MobileNumber, IReadOnlyCollection<string> Roles);
