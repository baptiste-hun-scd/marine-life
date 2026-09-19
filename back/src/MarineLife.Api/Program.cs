using MarineLife.Api.Endpoints;
using MarineLife.Api.RateLimiting;
using MarineLife.Business;
using MarineLife.Database;
using MarineLife.Database.Seed;
using MarineLife.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

const string FrontCorsPolicy = "Front";

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddCors(options =>
    options.AddPolicy(
        FrontCorsPolicy,
        policy => policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

var connectionString = builder.Configuration.GetConnectionString("MarineLife")
    ?? throw new InvalidOperationException("Missing 'MarineLife' connection string.");

builder.Services.AddDatabase(connectionString);
builder.Services.AddBusiness();
builder.Services.AddInfrastructure();

builder.Services.AddApiRateLimiting(builder.Configuration);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<MarineLifeDbContext>();
    await dbContext.Database.EnsureCreatedAsync();
    await DbSeeder.SeedAsync(dbContext);
}

app.UseCors(FrontCorsPolicy);
app.UseApiRateLimiting();

app.MapSpeciesEndpoints();
app.MapTaxonomyEndpoints();

app.Run();
