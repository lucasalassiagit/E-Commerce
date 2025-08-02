using ApiPeliculas.Tools;
using System.ComponentModel.DataAnnotations;

namespace ApiPeliculas.Modelos.Dto.DtoProductos
{
    public class CrearProductoDto
    {
        [Required (ErrorMessage = "Debe ingresar el nombre del producto")]
        public string Nombre { get; set; }

        [Required (ErrorMessage = "Debe ingresar una descripcion del producto")]
        public string Descripcion { get; set; }


        [Required (ErrorMessage = "Debe ingresar el precio del producto")]
        [TwoDecimalPlaces]
        public decimal Precio { get; set; }

        [Required (ErrorMessage = "Debe ingresar el stock, si no tiene stock en este momento ingrese 0")]
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad minima es 0")]
        public int Stock { get; set; }

        [Required (ErrorMessage = "Debe ingresar una imagen del producto")]
        [ValidImage(2)]   //Aplicamos esta validacion de imagen personalizada, son 2 MB maximo de la imagen que se suba
        public IFormFile Imagen { get; set; } // imagen enviada desde React     
    }
}
