using ConcreteAssociation.Application.Auth;
using ConcreteAssociation.Domain.Entities;

namespace ConcreteAssociation.Application.Abstractions;

public interface ITokenService
{
    AuthResponse CreateAuthResponse(User user, IReadOnlyCollection<string> roles);
    string HashToken(string token);
}
