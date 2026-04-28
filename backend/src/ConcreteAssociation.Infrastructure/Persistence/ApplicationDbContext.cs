using ConcreteAssociation.Application.Abstractions;
using ConcreteAssociation.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ConcreteAssociation.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<OtpRequest> OtpRequests => Set<OtpRequest>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(x => x.MobileNumber).IsUnique();
            entity.HasIndex(x => x.Username).IsUnique();
            entity.Property(x => x.FullName).HasMaxLength(128);
            entity.Property(x => x.MobileNumber).HasMaxLength(20);
            entity.Property(x => x.Username).HasMaxLength(64);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasIndex(x => x.Name).IsUnique();
            entity.Property(x => x.Name).HasMaxLength(64);
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasIndex(x => new { x.UserId, x.RoleId }).IsUnique();
            entity.HasOne(x => x.User).WithMany(x => x.UserRoles).HasForeignKey(x => x.UserId);
            entity.HasOne(x => x.Role).WithMany(x => x.UserRoles).HasForeignKey(x => x.RoleId);
        });

        modelBuilder.Entity<OtpRequest>(entity =>
        {
            entity.HasIndex(x => x.MobileNumber);
            entity.Property(x => x.MobileNumber).HasMaxLength(20);
            entity.Property(x => x.OtpHash).HasMaxLength(256);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.Property(x => x.EventType).HasMaxLength(100);
            entity.Property(x => x.Target).HasMaxLength(100);
            entity.Property(x => x.IpAddress).HasMaxLength(64);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(x => x.TokenHash).IsUnique();
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var updatedEntries = ChangeTracker.Entries<BaseEntity>()
            .Where(x => x.State is EntityState.Added or EntityState.Modified);

        foreach (var entry in updatedEntries)
        {
            entry.Entity.UpdatedAtUtc = DateTime.UtcNow;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
