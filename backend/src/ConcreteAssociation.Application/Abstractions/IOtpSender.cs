namespace ConcreteAssociation.Application.Abstractions;

public interface IOtpSender
{
    Task SendAsync(string mobileNumber, string otpCode, CancellationToken cancellationToken);
}
