namespace Domain.Models.Requests.AuthRequests;

public class ForgotPasswordRequest
{
    public string Email { get; set; } = default!;
}
