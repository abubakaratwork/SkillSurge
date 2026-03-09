namespace Domain.Models.Requests.RoleRequests;

public class CreateRoleRequest
{
    public string Name { get; set; } = default!;
    public int Level { get; set; }
}
