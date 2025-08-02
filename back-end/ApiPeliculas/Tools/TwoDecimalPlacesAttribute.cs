using System.ComponentModel.DataAnnotations;

namespace ApiPeliculas.Tools
{
    public class TwoDecimalPlacesAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is decimal precio)
            {
                if (precio != decimal.Round(precio, 2))
                {
                    return new ValidationResult("El precio solo puede tener dos decimales.");
                }
            }

            return ValidationResult.Success;
        }
    }
}
