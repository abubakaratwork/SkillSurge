namespace Domain.Models.Requests.RoleRequests;

public class UpdateRoleRequest
{
    public string Name { get; set; } = default!;
    public int Level { get; set; }
}
