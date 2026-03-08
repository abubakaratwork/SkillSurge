namespace Domain.Models.Requests.UserRequests;

public class UpdateUserProfileRequest
{
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
}