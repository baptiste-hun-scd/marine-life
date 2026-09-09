using MarineLife.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarineLife.Database;

public class MarineLifeDbContext(DbContextOptions<MarineLifeDbContext> options) : DbContext(options)
{
    public DbSet<Embranchement> Embranchements => Set<Embranchement>();
    public DbSet<Classe> Classes => Set<Classe>();
    public DbSet<Ordre> Ordres => Set<Ordre>();
    public DbSet<Species> Species => Set<Species>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Embranchement>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Nom).IsUnique();
        });

        modelBuilder.Entity<Classe>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity
                .HasOne(e => e.Embranchement)
                .WithMany(e => e.Classes)
                .HasForeignKey(e => e.EmbranchementId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Ordre>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity
                .HasOne(e => e.Classe)
                .WithMany(e => e.Ordres)
                .HasForeignKey(e => e.ClasseId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Species>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.VulnerabilityLevel).HasConversion<string>();
            entity
                .HasOne(e => e.Ordre)
                .WithMany(e => e.Species)
                .HasForeignKey(e => e.OrdreId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
