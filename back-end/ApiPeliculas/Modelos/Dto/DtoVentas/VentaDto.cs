using System.ComponentModel.DataAnnotations;

namespace ApiPeliculas.Modelos.Dto.DtoVentas
{
    public class VentaDto
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public string CompradorNombre { get; set; }
        public ICollection<DetalleVentaRespuestaDto> Detalles { get; set; }
    }
}
