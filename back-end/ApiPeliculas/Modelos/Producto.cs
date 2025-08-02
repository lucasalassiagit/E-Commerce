namespace ApiPeliculas.Modelos
{
    public class Producto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public string? ImagenUrl { get; set; }
        public string? RutaLocalImagen { get; set; }   // Luego borrar solo para desarrollo
        public string UsuarioId { get; set; }            // FK al vendedor
        public ApplicationUser Usuario { get; set; }
        public bool Estado {  get; set; } = true; 
    }
}
