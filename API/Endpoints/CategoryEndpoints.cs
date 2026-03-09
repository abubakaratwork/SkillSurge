using Domain.Entities;
using System.Security.Claims;

namespace API.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder builder)
    {
        var endpoints = builder.MapGroup("categories")
                               .WithTags("Categories");

        endpoints.MapPost("/", CreateCategoryAsync)
                 .RequireAuthorization("Admin");

        endpoints.MapPut("/{id:guid}", UpdateCategoryAsync)
                 .RequireAuthorization("Admin");

        endpoints.MapDelete("/{id:guid}", DeleteCategoryAsync)
                 .RequireAuthorization("Admin");

        endpoints.MapGet("/", GetAllCategoriesAsync)
                 .RequireAuthorization();

        endpoints.MapGet("/{id:guid}", GetCategoryByIdAsync)
                 .RequireAuthorization();

        endpoints.MapGet("/{id:guid}/subcategories", GetSubCategoriesAsync)
                 .RequireAuthorization();
        //endpoints.MapGet("/tree", GetCategoryTreeAsync);
    }

    public static async Task<IResult> CreateCategoryAsync(
       [FromBody] CreateCategoryRequest request,
       ICategoryService categoryService,
       ClaimsPrincipal user)
    {
        request.UserId = user.GetUserId();
        var result = await categoryService.CreateCategoryAsync(request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> UpdateCategoryAsync(
        Guid id,
        [FromBody] UpdateCategoryRequest request,
        ICategoryService categoryService,
        ClaimsPrincipal user)
    {
        request.UserId = user.GetUserId();
        var result = await categoryService.UpdateCategoryAsync(id, request);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> DeleteCategoryAsync(
        Guid id,
        ICategoryService categoryService,
        ClaimsPrincipal user)
    {
        var result = await categoryService.DeleteCategoryAsync(id, user.GetUserId());

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetAllCategoriesAsync(
        ICategoryService categoryService)
    {
        var result = await categoryService.GetRootCategoriesAsync();

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    public static async Task<IResult> GetCategoryByIdAsync(
        Guid id,
        ICategoryService categoryService)
    {
        var result = await categoryService.GetCategoryByIdAsync(id);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }

    //public static async Task<IResult> GetCategoryTreeAsync(
    //    ICategoryService categoryService)
    //{
    //    var result = await categoryService.GetCategoryTreeAsync();

    //    return result.Success
    //            ? Results.Ok(result)
    //            : Results.BadRequest(result);
    //}

    public static async Task<IResult> GetSubCategoriesAsync(
        Guid id,
        ICategoryService categoryService)
    {
        var result = await categoryService.GetSubCategoriesAsync(id);

        return result.Success
                ? Results.Ok(result)
                : Results.BadRequest(result);
    }
}
