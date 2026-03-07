namespace Domain.Entities;

public class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public int Level { get; set; }
}
