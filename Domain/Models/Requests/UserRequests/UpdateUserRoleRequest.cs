namespace Domain.Models.Requests.UserRequests;

public class UpdateUserRoleRequest
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
}