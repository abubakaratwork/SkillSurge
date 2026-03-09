using System.Security.Claims;

namespace API.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("products")
                               .WithTags("Products")
                               .RequireAuthorization();

        endpoints.MapPost("/", CreateProductAsync);

        endpoints.MapPut("/{id:guid}", UpdateProductAsync);

        endpoints.MapDelete("/{id:guid}", DeleteProductAsync);

        endpoints.MapGet("/", GetAllProductsAsync);

        endpoints.MapGet("/{id:guid}", GetProductByIdAsync);

        endpoints.MapGet("/my", GetMyProductsAsync);
    }

    public static async Task<IResult> CreateProductAsync(
        [FromBody] CreateProductRequest request,
        IProductService productService,
        ClaimsPrincipal user)
    {
        request.UserId = user.GetUserId();
        var result = await productService.CreateProductAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> UpdateProductAsync(
        Guid id,
        [FromBody] UpdateProductRequest request,
        IProductService productService,
        ClaimsPrincipal user)
    {
        request.UserId = user.GetUserId();
        var result = await productService.UpdateProductAsync(id, request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> DeleteProductAsync(
        Guid id,
        IProductService productService,
        ClaimsPrincipal user)
    {
        var result = await productService.DeleteProductAsync(id, user.GetUserId());

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetAllProductsAsync(
        IProductService productService)
    {
        var result = await productService.GetAllProductsAsync();

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetProductByIdAsync(
        Guid id,
        IProductService productService)
    {
        var result = await productService.GetProductByIdAsync(id);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetMyProductsAsync(
        IProductService productService,
        ClaimsPrincipal user)
    {
        var result = await productService.GetMyProductsAsync(user.GetUserId());

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }
}
