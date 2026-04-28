using ConcreteAssociation.Infrastructure.Services;

namespace ConcreteAssociation.Tests.Auth;

public class MobileNumberServiceTests
{
    private readonly MobileNumberService _service = new();

    [Theory]
    [InlineData("+989121234567", "09121234567")]
    [InlineData("00989121234567", "09121234567")]
    [InlineData("0912-123-4567", "09121234567")]
    public void Normalize_ShouldProduceIranianMobileFormat(string input, string expected)
    {
        var result = _service.Normalize(input);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("09121234567", true)]
    [InlineData("08121234567", false)]
    [InlineData("123", false)]
    public void IsValid_ShouldValidateFormat(string input, bool expected)
    {
        Assert.Equal(expected, _service.IsValid(input));
    }
}
