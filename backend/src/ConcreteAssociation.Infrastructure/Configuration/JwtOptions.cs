namespace ConcreteAssociation.Infrastructure.Configuration;

public class JwtOptions
{
    public const string SectionName = "Jwt";
    public string Issuer { get; set; } = "ConcreteAssociation";
    public string Audience { get; set; } = "ConcreteAssociationUsers";
    public string SecretKey { get; set; } = "ChangeMe_AtLeast32Characters_Long_Key";
    public int AccessTokenMinutes { get; set; } = 30;
    public int RefreshTokenDays { get; set; } = 7;
}
