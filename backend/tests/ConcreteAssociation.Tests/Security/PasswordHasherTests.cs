using ConcreteAssociation.Infrastructure.Services;

namespace ConcreteAssociation.Tests.Security;

public class PasswordHasherTests
{
    [Fact]
    public void HashAndVerify_ShouldWork()
    {
        var hasher = new PasswordHasherAdapter();
        const string password = "MySecurePass123!";

        var hash = hasher.Hash(password);

        Assert.NotEqual(password, hash);
        Assert.True(hasher.Verify(hash, password));
        Assert.False(hasher.Verify(hash, "wrong-password"));
    }
}
