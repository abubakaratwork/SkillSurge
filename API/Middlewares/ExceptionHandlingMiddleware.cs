using Domain.Models.Responses;
using System.Net;
using System.Text.Json;
using FluentValidation;

namespace API.Middlewares;

public class ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment hostEnvironment) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        object response;
        int statusCode;

        switch (exception)
        {
            case ValidationException validationEx:

                statusCode = (int)HttpStatusCode.BadRequest;
                var errors = validationEx.Errors.GroupBy(e => e.PropertyName)
                                                .ToDictionary(g => g.Key, g => g.First().ErrorMessage);
                response = new
                {
                    statusCode,
                    message = "Validation failed",
                    errors = errors
                };
                break;

            default:

                statusCode = (int)HttpStatusCode.InternalServerError;
                response = hostEnvironment.IsDevelopment()
                    ? new ApiExceptionResponse(statusCode, exception.Message, exception.StackTrace?.ToString())
                    : new ApiExceptionResponse(statusCode, exception.Message, "Internal server error");
                break;
        }

        logger.LogError(exception, exception.Message);
        context.Response.StatusCode = statusCode;

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);
    }
}
