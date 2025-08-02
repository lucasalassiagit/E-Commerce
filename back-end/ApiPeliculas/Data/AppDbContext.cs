using ApiPeliculas.Modelos;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace ApiPeliculas.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Producto> Producto { get; set; }
        public DbSet<Venta> Venta { get; set; }
        public DbSet<DetalleVenta> DetallesVenta { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>()
                   .HasMany(u => u.ProductosPublicados)
                   .WithOne(p => p.Usuario)
                   .HasForeignKey(p => p.UsuarioId);

            builder.Entity<ApplicationUser>()
                   .HasMany(u => u.VentasRealizadas)
                   .WithOne(v => v.Usuario)
                   .HasForeignKey(v => v.UsuarioId);

            builder.Entity<DetalleVenta>()
                    .HasOne(d => d.Venta)
                    .WithMany(v => v.Detalles)
                    .HasForeignKey(d => d.VentaId)
                    .OnDelete(DeleteBehavior.Restrict);

            // Precio y Totales con precisión
            builder.Entity<Venta>()
                   .Property(v => v.Total)
                   .HasPrecision(18, 2);

            builder.Entity<DetalleVenta>()
                   .Property(d => d.PrecioUnitario)
                   .HasPrecision(18, 2);

            builder.Entity<Producto>()
                   .Property(p => p.Precio)
                   .HasPrecision(18, 2);

            // Manejo de DateTime
            builder.Entity<Venta>()
                   .Property(v => v.Fecha)
                   .HasColumnType("timestamp without time zone");
        }
    }
}
