using ApiPeliculas.Tools;
using System.ComponentModel.DataAnnotations;

namespace ApiPeliculas.Modelos.Dto.DtoUsuarios
{
    public class UsuarioRegistroDto
    {
        [Required(ErrorMessage = "El nombre de usuario es obligatorio")]
        [StringLength(60,MinimumLength = 6, ErrorMessage = "El nombre de usuario debe tener al menos 6 caracteres")]
        public string NombreUsuario { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(60, MinimumLength = 3, ErrorMessage = "El nombre debe tener al menos 3 caracteres")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Debe ingresar un formato valido de email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El password es obligatorio")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Debe ingresar un usuario")]
        [RolValido]
        public string Rol { get; set; }
    }
}
