using ConcreteAssociation.Application.Abstractions;
using Microsoft.AspNetCore.Identity;

namespace ConcreteAssociation.Infrastructure.Services;

public class PasswordHasherAdapter : IPasswordHasher
{
    private readonly PasswordHasher<string> _hasher = new();

    public string Hash(string password) => _hasher.HashPassword("user", password);

    public bool Verify(string hashedPassword, string providedPassword)
    {
        var result = _hasher.VerifyHashedPassword("user", hashedPassword, providedPassword);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
