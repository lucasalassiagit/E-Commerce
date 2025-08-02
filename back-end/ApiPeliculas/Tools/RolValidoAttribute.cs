using System.ComponentModel.DataAnnotations;

namespace ApiPeliculas.Tools
{

    //Este ValidationAttribute esta construido para validar que cuando el usuario ingresa el rol
    // sea uno valido, en esta aplicacion deben ser algunos de estos: "Admin", "Comprador", "Vendedor"

    // Y se utiliza en el modelo que necesitamos de esta manera: [RolValido]
    public class RolValidoAttribute : ValidationAttribute
    {
        private readonly string[] _rolesValidos = { "Admin", "Comprador", "Vendedor" };

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || !_rolesValidos.Contains(value.ToString()))
            {
                return new ValidationResult("El rol no es válido. Debe ser Admin, Comprador o Vendedor.");
            }

            return ValidationResult.Success;
        }
    }
}
