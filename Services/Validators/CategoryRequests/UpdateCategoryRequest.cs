namespace Services.Validators.CategoryRequests;

public class UpdateCategoryRequestValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.UserId)
           .NotEmpty().WithMessage("UserId is required.");
    }
}