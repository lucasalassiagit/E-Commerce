using ApiPeliculas.Tools;
using System.ComponentModel.DataAnnotations;

namespace ApiPeliculas.Modelos.Dto.DtoVentas
{
    public class DetalleVentaDto
    {
        [Required(ErrorMessage = "El productoId es obligatorio")]
        public int ProductoId { get; set; }

        [Required(ErrorMessage = "La cantidad es obligatoria")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad minima es 1")]
        public int Cantidad { get; set; }

        [Required(ErrorMessage = "El precio unitario es obligatorio")]
        [TwoDecimalPlaces]
        public decimal PrecioUnitario { get; set; }
    }
}