namespace ConcreteAssociation.Domain.Enums;

public static class SystemRole
{
    public const string Member = "Member";
    public const string AssociationAdmin = "AssociationAdmin";
    public const string SystemAdmin = "SystemAdmin";

    public static IReadOnlyCollection<string> All =>
        [Member, AssociationAdmin, SystemAdmin];
}
