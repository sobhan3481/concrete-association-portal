namespace ConcreteAssociation.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsMobileVerified { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
