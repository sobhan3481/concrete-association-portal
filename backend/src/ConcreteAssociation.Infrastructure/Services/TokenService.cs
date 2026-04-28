using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ConcreteAssociation.Application.Abstractions;
using ConcreteAssociation.Application.Auth;
using ConcreteAssociation.Domain.Entities;
using ConcreteAssociation.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ConcreteAssociation.Infrastructure.Services;

public class TokenService(IOptions<JwtOptions> options) : ITokenService
{
    private readonly JwtOptions _options = options.Value;

    public AuthResponse CreateAuthResponse(User user, IReadOnlyCollection<string> roles)
    {
        var expires = DateTime.UtcNow.AddMinutes(_options.AccessTokenMinutes);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.Username),
            new("mobile", user.MobileNumber)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new JwtSecurityToken(
            _options.Issuer,
            _options.Audience,
            claims,
            expires: expires,
            signingCredentials: creds);

        var accessToken = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        return new AuthResponse(
            accessToken,
            refreshToken,
            expires,
            new UserProfileResponse(user.Id, user.Username, user.FullName, user.MobileNumber, roles));
    }

    public string HashToken(string token)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(hash);
    }
}
