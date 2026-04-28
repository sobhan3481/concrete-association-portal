namespace ConcreteAssociation.Application.Abstractions;

public interface IAuditLogger
{
    Task LogAsync(string eventType, string target, object metadata, Guid? userId, string? ipAddress, CancellationToken cancellationToken);
}
