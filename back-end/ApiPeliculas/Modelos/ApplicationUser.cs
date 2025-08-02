using Microsoft.AspNetCore.Identity;

namespace ApiPeliculas.Modelos
{
    public class ApplicationUser : IdentityUser
    {
        public string NombreCompleto { get; set; }
        public ICollection<Producto> ProductosPublicados { get; set; }
        public ICollection<Venta> VentasRealizadas { get; set; }
    }
}
