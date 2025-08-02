using ApiPeliculas.Data;
using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Dto.DtoUsuarios;
using ApiPeliculas.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using XSystem.Security.Cryptography;

namespace ApiPeliculas.Repositorio
{
    public class UsuarioRepositorio : IUsuarioRepositorio
    {
        private readonly AppDbContext _bd;
        //para usar codigo que esta en appsettings.json
        private string claveSecreta;
        //Esto se agrega por Identity
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;

        public UsuarioRepositorio(AppDbContext bd, IConfiguration config, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper)
        {
            _bd = bd;
            claveSecreta = config.GetValue<string>("ApiSettings:Secreta");
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<ICollection<UsuarioDto>> GetUsuarios()
        {
            var usuarios = await _userManager.Users.OrderBy(c => c.NombreCompleto).ToListAsync();

            var listaUsuariosDto = new List<UsuarioDto>();

            foreach (var usuario in usuarios)
            {
                var roles = await _userManager.GetRolesAsync(usuario);
                listaUsuariosDto.Add(new UsuarioDto
                {
                    Id = usuario.Id,
                    Nombre = usuario.NombreCompleto,
                    Email = usuario.Email,
                    UserName = usuario.UserName,
                    Rol = roles.FirstOrDefault() // solo mostramos el primero
                });
            }

            return listaUsuariosDto;
        }

        public ApplicationUser GetUsuario(string usuarioId)
        {
            return _userManager.Users.FirstOrDefault(c => c.Id == usuarioId);
        }

        public bool IsUniqueUser(string usuario)
        {
            var usuarioBd = _userManager.Users.FirstOrDefault(c => c.UserName == usuario);
            if(usuarioBd == null)
            {
                return true; // Usuario único
            }
            return false; // Usuario ya existe
        }

        public async Task<UsuarioLoginRespuestaDto> Login(UsuarioLoginDto usuarioLoginDto)
        {
            

            var usuario = await _userManager.FindByNameAsync(usuarioLoginDto.NombreUsuario);
            if (usuario == null)
            {
                return new UsuarioLoginRespuestaDto
                {
                    Token = "",
                    Usuario = null
                };
            }

            //Este metodo de Identity comprueba la contraseña
            bool isValid = await _userManager.CheckPasswordAsync(usuario, usuarioLoginDto.Password);

            //Validamos si el usuario no existe con la combinacion de usuario y contraseña
            if (usuario == null || isValid == false)
            {
                return new UsuarioLoginRespuestaDto()
                {
                    Token = "",
                    Usuario = null
                };
            }
             
            //Aqui existe el usuario entonces podemos procesar el Login
            var roles = await _userManager.GetRolesAsync(usuario);
            var manejadorToken = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(claveSecreta);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Payload del token JWT
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id), // agrego esto por el error 401 al crear producto, importante que siempre este
                    new Claim(ClaimTypes.Name, usuario.UserName.ToString()),
                    new Claim(ClaimTypes.Role, roles.FirstOrDefault())
                }),
                Expires = DateTime.UtcNow.AddDays(7), // Expira en 7 días
                SigningCredentials = new(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = manejadorToken.CreateToken(tokenDescriptor);

            UsuarioLoginRespuestaDto usuarioLoginRespuestaDto = new UsuarioLoginRespuestaDto()
            {
                Token = manejadorToken.WriteToken(token),
                Rol = roles.FirstOrDefault(),
                Usuario = _mapper.Map<UsuarioDatosDto>(usuario)
            };

            return usuarioLoginRespuestaDto;
        }

        public async Task<UsuarioDatosDto> Registro(UsuarioRegistroDto usuarioRegistroDto)
        {

            // Verifico si el usuario es único
            //Se usa esta clase personalizada que hereda de IdentityUser
            ApplicationUser usuario = new ApplicationUser()
            {
                UserName = usuarioRegistroDto.NombreUsuario,
                Email = usuarioRegistroDto.Email,
                NombreCompleto = usuarioRegistroDto.Nombre
            };

            var result =  await _userManager.CreateAsync(usuario, usuarioRegistroDto.Password);

            //Si el usuario se creo correctamente, le asigno el rol segun lo que venga del front
            if (!string.IsNullOrEmpty(usuarioRegistroDto.Rol))
            {
                await _userManager.AddToRoleAsync(usuario, usuarioRegistroDto.Rol);
            }
                return _mapper.Map<UsuarioDatosDto>(usuario);
        }



    }
}
