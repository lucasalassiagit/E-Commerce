namespace ApiPeliculas.Tools
{
    using Microsoft.AspNetCore.Http;
    using System.ComponentModel.DataAnnotations;
    using System.IO;
    using System.Linq;

    public class ValidImageAttribute : ValidationAttribute
    {
        private readonly string[] _extensionesPermitidas = { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
        private readonly int _tamanoMaximoBytes;

        public ValidImageAttribute(int tamanoMaximoMB = 2)
        {
            _tamanoMaximoBytes = tamanoMaximoMB * 1024 * 1024;
            ErrorMessage = $"La imagen debe ser un archivo válido ({string.Join(", ", _extensionesPermitidas)}) y no superar los {tamanoMaximoMB}MB.";
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var archivo = value as IFormFile;

            if (archivo == null)
                return ValidationResult.Success; // Si es null, no se valida. Si querés que sea obligatorio, usá también [Required]

            var extension = Path.GetExtension(archivo.FileName).ToLower();

            if (!_extensionesPermitidas.Contains(extension))
                return new ValidationResult($"Extensión no permitida: {extension}. Solo se permiten: {string.Join(", ", _extensionesPermitidas)}");

            if (archivo.Length > _tamanoMaximoBytes)
                return new ValidationResult($"El tamaño máximo permitido es de {_tamanoMaximoBytes / (1024 * 1024)}MB");

            return ValidationResult.Success;
        }
    }
}
