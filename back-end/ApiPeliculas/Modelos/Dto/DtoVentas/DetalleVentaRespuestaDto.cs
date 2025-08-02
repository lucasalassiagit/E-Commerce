namespace ApiPeliculas.Modelos.Dto.DtoVentas
{
    public class DetalleVentaRespuestaDto
    {
        public string NombreProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string NombreVendedor {  get; set; }
    }
}
