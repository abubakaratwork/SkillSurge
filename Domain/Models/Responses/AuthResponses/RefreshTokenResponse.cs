namespace Domain.Models.Responses.AuthResponses;

public class RefreshTokenResponse
{
    public string Username { get; set; } = default!;
    public string AccessToken { get; set; } = default!;
    public int ExpiresInMinutes { get; set; }
    public string? RefreshToken { get; set; }
}
