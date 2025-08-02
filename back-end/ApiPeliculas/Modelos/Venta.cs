namespace ApiPeliculas.Modelos
{
    public class Venta
    {
        public int Id { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public string UsuarioId { get; set; }            // FK al comprador
        public ApplicationUser Usuario { get; set; }
        public ICollection<DetalleVenta> Detalles { get; set; }
    }
}
