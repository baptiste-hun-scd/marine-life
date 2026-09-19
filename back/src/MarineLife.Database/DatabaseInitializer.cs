using MarineLife.Database.Seed;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace MarineLife.Database;

public static class DatabaseInitializer
{
    /// <summary>
    /// Creates the SQLite file (and its parent directory) and the schema if they don't exist yet,
    /// then seeds the catalog from the JSON seed file.
    /// </summary>
    public static async Task InitializeAsync(MarineLifeDbContext dbContext, CancellationToken cancellationToken = default)
    {
        EnsureDataDirectoryExists(dbContext.Database.GetConnectionString());

        await dbContext.Database.EnsureCreatedAsync(cancellationToken);
        await DbSeeder.SeedAsync(dbContext, cancellationToken: cancellationToken);
    }

    private static void EnsureDataDirectoryExists(string? connectionString)
    {
        var dataSource = new SqliteConnectionStringBuilder(connectionString).DataSource;

        if (string.IsNullOrWhiteSpace(dataSource) || dataSource.StartsWith(':') || dataSource.StartsWith("file:"))
        {
            return;
        }

        var directory = Path.GetDirectoryName(Path.GetFullPath(dataSource));
        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }
    }
}
