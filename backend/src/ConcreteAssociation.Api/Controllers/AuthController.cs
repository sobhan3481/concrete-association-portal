using System.Security.Claims;
using ConcreteAssociation.Application.Abstractions;
using ConcreteAssociation.Application.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConcreteAssociation.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("request-otp")]
    public async Task<IActionResult> RequestOtp([FromBody] RequestOtpRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.RequestOtpAsync(request, HttpContext.Connection.RemoteIpAddress?.ToString(), cancellationToken);
        return result.Succeeded ? Ok(new { message = "کد تأیید ارسال شد." }) : BadRequest(new { message = result.Error });
    }

    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.VerifyOtpAsync(request, HttpContext.Connection.RemoteIpAddress?.ToString(), cancellationToken);
        return result.Succeeded ? Ok(new { message = "شماره موبایل تأیید شد." }) : BadRequest(new { message = result.Error });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.RegisterAsync(request, HttpContext.Connection.RemoteIpAddress?.ToString(), cancellationToken);
        return result.Succeeded ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.LoginAsync(request, HttpContext.Connection.RemoteIpAddress?.ToString(), cancellationToken);
        return result.Succeeded ? Ok(result.Value) : Unauthorized(new { message = result.Error });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue("sub");
        if (!Guid.TryParse(userIdValue, out var userId))
        {
            return Unauthorized(new { message = "توکن نامعتبر است." });
        }

        var result = await authService.GetProfileAsync(userId, cancellationToken);
        return result.Succeeded ? Ok(result.Value) : NotFound(new { message = result.Error });
    }
}
