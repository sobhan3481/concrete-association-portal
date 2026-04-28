using System.Text.RegularExpressions;
using ConcreteAssociation.Application.Abstractions;

namespace ConcreteAssociation.Infrastructure.Services;

public class MobileNumberService : IMobileNumberService
{
    private static readonly Regex DigitsRegex = new("[^0-9]", RegexOptions.Compiled);

    public string Normalize(string mobileNumber)
    {
        var normalized = DigitsRegex.Replace(mobileNumber.Trim(), string.Empty);

        if (normalized.StartsWith("0098"))
        {
            normalized = normalized[2..];
        }

        if (normalized.StartsWith("98") && normalized.Length == 12)
        {
            normalized = $"0{normalized[2..]}";
        }

        return normalized;
    }

    public bool IsValid(string mobileNumber)
    {
        var normalized = Normalize(mobileNumber);
        return normalized.Length == 11 && normalized.StartsWith("09");
    }
}
