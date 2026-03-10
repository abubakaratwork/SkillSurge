namespace Services.Validators.ProductRequests;

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0.");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required.")
            .Matches("^[A-Z]{3}$").WithMessage("Currency must be a 3-letter uppercase code.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("CategoryId is required.");
    }
}