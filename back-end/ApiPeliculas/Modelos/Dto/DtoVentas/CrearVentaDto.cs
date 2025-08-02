using System.ComponentModel.DataAnnotations;

namespace ApiPeliculas.Modelos.Dto.DtoVentas
{
    public class CrearVentaDto
    {
        [Required(ErrorMessage = "El Id de usuario es obligatorio")]
        public string UsuarioId { get; set; } // ID del comprador
        public List<DetalleVentaDto> Detalles { get; set; } = new List<DetalleVentaDto>();
    }
}
