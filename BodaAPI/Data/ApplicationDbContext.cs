// BodaAPI/Data/ApplicationDbContext.cs
using BodaAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BodaAPI.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Invitado> Invitados => Set<Invitado>();
    public DbSet<Acompanante> Acompanantes => Set<Acompanante>();
    public DbSet<VotoRegalo> VotosRegalos => Set<VotoRegalo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Invitado>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.Nombre).IsRequired().HasMaxLength(200);
            e.HasMany(i => i.Acompanantes)
             .WithOne(a => a.Invitado)
             .HasForeignKey(a => a.InvitadoId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Acompanante>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.Nombre).IsRequired().HasMaxLength(200);
            e.Property(a => a.Tipo).HasConversion<string>();
        });

        modelBuilder.Entity<VotoRegalo>(e =>
        {
            e.HasKey(v => v.Id);
            e.Property(v => v.Opcion).IsRequired().HasMaxLength(200);
            e.Property(v => v.NombreInvitado).IsRequired().HasMaxLength(200);
        });
    }
}
