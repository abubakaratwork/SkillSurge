namespace Services.Validators.UserRequests;

public class UpdateUserStatusRequestValidator : AbstractValidator<UpdateUserStatusRequest>
{
    public UpdateUserStatusRequestValidator()
    {
        RuleFor(x => x.IsActive)
            .NotNull()
            .WithMessage("IsActive is required.");
    }
}
