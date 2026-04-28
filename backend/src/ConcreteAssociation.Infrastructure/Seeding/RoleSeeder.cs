using ConcreteAssociation.Domain.Entities;
using ConcreteAssociation.Domain.Enums;
using ConcreteAssociation.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ConcreteAssociation.Infrastructure.Seeding;

public static class RoleSeeder
{
    public static async Task SeedAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken = default)
    {
        var existingRoles = await dbContext.Roles.Select(x => x.Name).ToListAsync(cancellationToken);
        var missingRoles = SystemRole.All.Where(role => !existingRoles.Contains(role)).ToList();

        if (missingRoles.Count == 0)
        {
            return;
        }

        dbContext.Roles.AddRange(missingRoles.Select(role => new Role { Name = role }));
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
