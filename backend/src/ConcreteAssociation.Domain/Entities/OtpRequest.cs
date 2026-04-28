namespace ConcreteAssociation.Domain.Entities;

public class OtpRequest : BaseEntity
{
    public string MobileNumber { get; set; } = string.Empty;
    public string OtpHash { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
    public int AttemptCount { get; set; }
    public int MaxAttempts { get; set; } = 5;
    public bool IsVerified { get; set; }
    public DateTime? VerifiedAtUtc { get; set; }
}
