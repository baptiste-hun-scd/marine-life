using Microsoft.Extensions.DependencyInjection;

namespace MarineLife.Infrastructure;

/// <summary>
/// Composition root for outbound integrations (external APIs, storage, email, ...).
/// Empty for now: wire up HttpClients/clients here as external dependencies are introduced.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services) => services;
}
