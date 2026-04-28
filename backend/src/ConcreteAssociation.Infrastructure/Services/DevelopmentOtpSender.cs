using ConcreteAssociation.Application.Abstractions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ConcreteAssociation.Infrastructure.Services;

public class DevelopmentOtpSender(IHostEnvironment env, ILogger<DevelopmentOtpSender> logger) : IOtpSender
{
    public Task SendAsync(string mobileNumber, string otpCode, CancellationToken cancellationToken)
    {
        if (env.IsDevelopment())
        {
            logger.LogInformation("DEV OTP for {Mobile}: {Code}", mobileNumber, otpCode);
        }

        return Task.CompletedTask;
    }
}
