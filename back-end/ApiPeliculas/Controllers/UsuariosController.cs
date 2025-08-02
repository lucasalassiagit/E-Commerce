using ApiPeliculas.Data;
using ApiPeliculas.Modelos.Dto.DtoUsuarios;
using ApiPeliculas.Repositorio.IRepositorio;
using ApiPeliculas.Tools;
using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using XAct;

namespace ApiPeliculas.Controllers
{
    [Route("api/usuarios")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IUsuarioRepositorio _usRepo;
        private readonly IMapper _mapper;

        public UsuariosController(IUsuarioRepositorio usRepo, IMapper mapper)
        {
            _usRepo = usRepo;
            _mapper = mapper;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUsuarios()
        {
            var listaUsuariosDto = await _usRepo.GetUsuarios();

            //Verificamos que la lista es nula o esta vacia
            
            if(listaUsuariosDto == null || listaUsuariosDto.Any())
            {
                var mensaje = new List<string> { "No hay usuarios registrados" };
                return Ok(RespuestaApi<string>.Error(mensaje, HttpStatusCode.NoContent));
            }
            
            return Ok(RespuestaApi<object>.Success(listaUsuariosDto));

        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{usuarioId}", Name = "GetUsuario")]  //Name: No afecta la URL,
                                                           //sino que es un identificador único para referenciar esta ruta en otros lugares
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetUsuario(string usuarioId)
        {
            var itemUsuario = _usRepo.GetUsuario(usuarioId);

            //Validamos si existe
            if (itemUsuario == null)
            {
                var errores = new List<string> { "El usuario no existe" };
                return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
                
            }

            var itemUsuarioDto = _mapper.Map<UsuarioDto>(itemUsuario);

            return Ok(RespuestaApi<object>.Success(itemUsuarioDto));
        }

        [AllowAnonymous]
        [HttpPost("registro")] 
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Registro([FromBody]UsuarioRegistroDto usuarioRegistroDto)
        {
            //Validamos el Modelo que viene del front

            if (!ModelState.IsValid)
            {
                var errores = ExtraerErroresModelState.Extraer(ModelState);
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            // Validamos que no haya un nombre de usuario existente igual

            bool validarNombreUsuarioUnico = _usRepo.IsUniqueUser(usuarioRegistroDto.NombreUsuario); 
            if(!validarNombreUsuarioUnico)
            {
                var errores = new List<string> { "El nombre de usuario ya existe" };
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            //Validamos que del repositorio se traiga el usuario

            var usuarioDatosDto = await _usRepo.Registro(usuarioRegistroDto);
            if (usuarioDatosDto == null)
            {
                var errores = new List<string> { "Error al registrar el usuario" };
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            return Ok(RespuestaApi<object>.Success(usuarioDatosDto));
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDto usuarioLoginDto)
        {
            
            //Validacion del modelo 

            if (!ModelState.IsValid)
            {
                var errores = new List<string> { "Usuario o password incorrectos" };
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            //Logica del login, usuario y password

            var respuestaLogin = await _usRepo.Login(usuarioLoginDto);
            
            if (respuestaLogin.Usuario == null || string.IsNullOrEmpty(respuestaLogin.Token))
            {
                var errores = new List<string> {"Usuario o password incorrectos"};
                return BadRequest(RespuestaApi<string>.Error(errores));
            }


            return Ok(RespuestaApi<object>.Success(respuestaLogin));
        }
    }
}
