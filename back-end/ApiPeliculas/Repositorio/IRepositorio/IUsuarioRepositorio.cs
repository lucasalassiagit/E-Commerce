using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Dto.DtoUsuarios;

namespace ApiPeliculas.Repositorio.IRepositorio
{
    public interface IUsuarioRepositorio
    {
        Task<ICollection<UsuarioDto>> GetUsuarios();
        ApplicationUser GetUsuario(string usuarioId);
        bool IsUniqueUser(string usuario);
        Task<UsuarioLoginRespuestaDto> Login(UsuarioLoginDto usuarioLoginDto);
        Task<UsuarioDatosDto> Registro(UsuarioRegistroDto usuarioRegistroDto);
    }
}
