using ConcreteAssociation.Domain.Enums;
using ConcreteAssociation.Infrastructure.Persistence;
using ConcreteAssociation.Infrastructure.Seeding;
using Microsoft.EntityFrameworkCore;

namespace ConcreteAssociation.Tests.Auth;

public class RoleSeederTests
{
    [Fact]
    public async Task SeedAsync_ShouldBeIdempotentAndCreateDefaultRoles()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var db = new ApplicationDbContext(options);

        await RoleSeeder.SeedAsync(db);
        await RoleSeeder.SeedAsync(db);

        var roles = await db.Roles.Select(x => x.Name).ToListAsync();

        Assert.Equal(SystemRole.All.Count, roles.Count);
        Assert.All(SystemRole.All, role => Assert.Contains(role, roles));
    }
}
