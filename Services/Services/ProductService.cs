namespace Services.Services;

public class ProductService(
    IProductRepository productRepository,
    IValidator<CreateProductRequest> createValidator,
    IValidator<UpdateProductRequest> updateValidator
) : IProductService
{
    public async Task<Result<bool>> CreateProductAsync(CreateProductRequest request)
    {
        var validationResult = await createValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CategoryId = request.CategoryId,
            OwnerId = request.UserId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        await productRepository.AddAsync(product);

        return Result<bool>.SuccessResult(true, "Product created successfully.");
    }

    public async Task<Result<bool>> DeleteProductAsync(Guid id, Guid userId)
    {
        var product = await productRepository.GetByIdAsync(id);

        if (product == null || product.IsDeleted)
            return Result<bool>.FailureResult("Product not found");

        if (product.OwnerId != userId)
            return Result<bool>.FailureResult("You are not allowed to delete this product");

        await productRepository.SoftDeleteAsync(id);

        return Result<bool>.SuccessResult(true, "Product deleted successfully.");
    }

    public async Task<Result<List<Product>>> GetAllProductsAsync()
    {
        var products = await productRepository.GetAllAsync(1, 50);

        return Result<List<Product>>.SuccessResult(products.ToList(), "Products fetched successfully.");
    }

    public async Task<Result<List<Product>>> GetMyProductsAsync(Guid userId)
    {
        var products = await productRepository.GetByOwnerAsync(userId);

        return Result<List<Product>>.SuccessResult(products.ToList(), "");
    }

    public async Task<Result<Product>> GetProductByIdAsync(Guid id)
    {
        var product = await productRepository.GetByIdAsync(id);

        if (product == null || product.IsDeleted)
            return Result<Product>.FailureResult("Product not found");

        return Result<Product>.SuccessResult(product, "Product fetched successfully.");
    }

    public async Task<Result<bool>> UpdateProductAsync(Guid id, UpdateProductRequest request)
    {
        var validationResult = await updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
            throw new ValidationException(validationResult.Errors);

        var product = await productRepository.GetByIdAsync(id);

        if (product == null || product.IsDeleted)
            return Result<bool>.FailureResult("Product not found");

        if (product.OwnerId != request.UserId)
            return Result<bool>.FailureResult("You are not allowed to update this product");

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.CategoryId = request.CategoryId;
        product.UpdatedAt = DateTime.UtcNow;

        await productRepository.UpdateAsync(product);

        return Result<bool>.SuccessResult(true, "Product updated successfully.");
    }
}