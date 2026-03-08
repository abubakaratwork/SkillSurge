namespace Domain.Models.Requests.UserRequests;

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = default!;
    public string NewPassword { get; set; } = default!;
    public Guid UserId { get; set; }
}