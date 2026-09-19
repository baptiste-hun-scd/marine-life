namespace MarineLife.Api.RateLimiting;

public class RateLimitingOptions
{
    public const string SectionName = "RateLimiting";

    /// <summary>Requests allowed per client IP, across the whole API, per <see cref="WindowSeconds"/>.</summary>
    public int PermitLimit { get; set; } = 60;

    /// <summary>Requests allowed per client IP on the search endpoint (the most expensive one), per <see cref="WindowSeconds"/>.</summary>
    public int SearchPermitLimit { get; set; } = 20;

    public int WindowSeconds { get; set; } = 60;

    /// <summary>
    /// Read the client IP from X-Forwarded-For / X-Forwarded-Proto. Enable only when the API sits behind a
    /// reverse proxy, otherwise clients could spoof their IP and bypass the limiter.
    /// </summary>
    public bool TrustForwardedHeaders { get; set; }
}
