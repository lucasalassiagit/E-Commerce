using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ApiPeliculas.Tools
{
    //Esta clase sirve para extraer los errores de los ModelState 
    public class ExtraerErroresModelState
    {
        public static List<string> Extraer(ModelStateDictionary modelState)
        {
            return modelState.Values
                .SelectMany(v => v.Errors)  // Extrae todos los errores de todas las propiedades
                .Select(e => e.ErrorMessage)  // Se queda con el texto del error
                .ToList();  
        }
    }
}
