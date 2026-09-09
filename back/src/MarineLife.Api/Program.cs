using MarineLife.Api.Endpoints;
using MarineLife.Business;
using MarineLife.Database;
using MarineLife.Database.Seed;
using MarineLife.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

const string AngularDevCorsPolicy = "AngularDev";

builder.Services.AddCors(options =>
    options.AddPolicy(
        AngularDevCorsPolicy,
        policy => policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

var connectionString = builder.Configuration.GetConnectionString("MarineLife")
    ?? throw new InvalidOperationException("Missing 'MarineLife' connection string.");

builder.Services.AddDatabase(connectionString);
builder.Services.AddBusiness();
builder.Services.AddInfrastructure();

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

app.UseCors(AngularDevCorsPolicy);

app.MapSpeciesEndpoints();
app.MapTaxonomyEndpoints();

app.Run();
