using System.Text.Json;
using ConcreteAssociation.Application.Abstractions;
using ConcreteAssociation.Domain.Entities;

namespace ConcreteAssociation.Infrastructure.Services;

public class AuditLogger(IApplicationDbContext dbContext) : IAuditLogger
{
    public async Task LogAsync(string eventType, string target, object metadata, Guid? userId, string? ipAddress, CancellationToken cancellationToken)
    {
        dbContext.AuditLogs.Add(new AuditLog
        {
            EventType = eventType,
            Target = target,
            MetadataJson = JsonSerializer.Serialize(metadata),
            UserId = userId,
            IpAddress = ipAddress
        });

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
