using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal claims)
    {
        var claim = claims.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null)
        {
            return Guid.Empty;
        }
        return Guid.TryParse(claim.Value, out var userId) ? userId : Guid.Empty;
    }

    public static string GetUserEmail(this ClaimsPrincipal claims)
    {
        var emailClaim = claims.FindFirst(ClaimTypes.Email);
        if (emailClaim == null)
        {
            return string.Empty;
        }
        return emailClaim.Value;
    }

    public static string GetUserRole(this ClaimsPrincipal claims)
    {
        var roleClaim = claims.FindFirst(ClaimTypes.Role);
        if (roleClaim == null)
        {
            return string.Empty;
        }
        return roleClaim.Value;
    }
}
