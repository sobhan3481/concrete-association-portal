namespace ConcreteAssociation.Application.Abstractions;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string hashedPassword, string providedPassword);
}
