namespace ConcreteAssociation.Application.Abstractions;

public interface IMobileNumberService
{
    string Normalize(string mobileNumber);
    bool IsValid(string mobileNumber);
}
