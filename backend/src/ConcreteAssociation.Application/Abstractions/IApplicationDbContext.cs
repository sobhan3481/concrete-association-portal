using ConcreteAssociation.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConcreteAssociation.Application.Abstractions;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<OtpRequest> OtpRequests { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
