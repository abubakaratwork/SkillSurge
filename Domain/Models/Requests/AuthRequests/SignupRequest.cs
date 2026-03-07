namespace Domain.Models.Requests.AuthRequests;

public class SignupRequest
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public bool IsAgreedToTerms { get; set; }
}
