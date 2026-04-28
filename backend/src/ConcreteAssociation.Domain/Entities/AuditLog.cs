namespace ConcreteAssociation.Domain.Entities;

public class AuditLog : BaseEntity
{
    public Guid? UserId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public string MetadataJson { get; set; } = "{}";
    public string? IpAddress { get; set; }
}
