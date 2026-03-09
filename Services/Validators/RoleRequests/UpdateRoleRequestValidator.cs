using Domain.Models.Requests.RoleRequests;

namespace Services.Validators.RoleRequests;

public class UpdateRoleRequestValidator : AbstractValidator<UpdateRoleRequest>
{
    public UpdateRoleRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Role name is required.");

        RuleFor(x => x.Level)
            .GreaterThan(0).WithMessage("Level must be greater than zero.");
    }
}
