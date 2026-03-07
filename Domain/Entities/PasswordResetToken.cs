namespace Domain.Entities;

public class PasswordResetToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; } = default!;
    public DateTime ExpiryDate { get; set; }
    public bool IsUsed { get; set; }
    public DateTime CreatedAt { get; set; }
}