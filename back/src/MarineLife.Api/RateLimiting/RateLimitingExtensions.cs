using System.Globalization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;

namespace MarineLife.Api.RateLimiting;

public static class RateLimitingExtensions
{
    public const string SearchPolicy = "search";

    public static IServiceCollection AddApiRateLimiting(this IServiceCollection services, IConfiguration configuration)
    {
        var options = configuration.GetSection(RateLimitingOptions.SectionName).Get<RateLimitingOptions>()
            ?? new RateLimitingOptions();
        var window = TimeSpan.FromSeconds(options.WindowSeconds);

        services.AddSingleton(options);

        services.AddRateLimiter(limiter =>
        {
            limiter.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

            // Applied to every request, whatever the endpoint.
            limiter.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
                RateLimitPartition.GetSlidingWindowLimiter(
                    ClientKey(context),
                    _ => SlidingWindow(options.PermitLimit, window)));

            // Applied in addition to the global limiter, on endpoints that opt in.
            limiter.AddPolicy(SearchPolicy, context =>
                RateLimitPartition.GetSlidingWindowLimiter(
                    ClientKey(context),
                    _ => SlidingWindow(options.SearchPermitLimit, window)));

            limiter.OnRejected = (context, _) =>
            {
                // Sliding-window leases carry no RetryAfter metadata; fall back to the full window.
                var retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var suggested)
                    ? suggested
                    : window;
                context.HttpContext.Response.Headers.RetryAfter =
                    ((int)Math.Ceiling(retryAfter.TotalSeconds)).ToString(CultureInfo.InvariantCulture);

                return ValueTask.CompletedTask;
            };
        });

        if (options.TrustForwardedHeaders)
        {
            services.Configure<ForwardedHeadersOptions>(forwarded =>
            {
                forwarded.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                forwarded.ForwardLimit = 1;
                // Trust whichever proxy sits in front; restrict with KnownProxies/KnownNetworks if it is known.
                forwarded.KnownIPNetworks.Clear();
                forwarded.KnownProxies.Clear();
            });
        }

        return services;
    }

    public static IApplicationBuilder UseApiRateLimiting(this WebApplication app)
    {
        if (app.Services.GetRequiredService<RateLimitingOptions>().TrustForwardedHeaders)
        {
            app.UseForwardedHeaders();
        }

        return app.UseRateLimiter();
    }

    private static string ClientKey(HttpContext context) =>
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown";

    private static SlidingWindowRateLimiterOptions SlidingWindow(int permitLimit, TimeSpan window) =>
        new()
        {
            PermitLimit = permitLimit,
            Window = window,
            SegmentsPerWindow = 6,
            QueueLimit = 0,
        };
}
