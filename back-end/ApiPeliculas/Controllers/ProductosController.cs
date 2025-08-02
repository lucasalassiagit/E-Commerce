using ApiPeliculas.Data;
using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Base.Dtos;
using ApiPeliculas.Modelos.Dto.DtoProductos;
using ApiPeliculas.Modelos.Dto.DtoVentas;
using ApiPeliculas.Repositorio.IRepositorio;
using ApiPeliculas.Tools;
using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;
using XAct.Diagnostics.Status.Connectors.Implementations;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ApiPeliculas.Controllers.Base.V1
{
    [Route("api/productos")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IProductoRepositorio _prodRepo;
        private readonly IMapper _mapper;

        public ProductosController(IProductoRepositorio prodRepo, IMapper mapper)
        {
            _prodRepo = prodRepo;
            _mapper = mapper;
        }

        // Paginacion en el back la dejo para despues

        //[AllowAnonymous]
        //[HttpGet]
        //[ProducesResponseType(StatusCodes.Status403Forbidden)]
        //[ProducesResponseType(StatusCodes.Status200OK)]
        //public IActionResult GetProductos([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 2)
        //{
        //    try
        //    {
        //        var totalProductos = _prodRepo.getTotalProductos();
        //        var productos = _prodRepo.GetProductos(pageNumber, pageSize);

        //        if(productos == null || !productos.Any())
        //        {
        //            return NotFound("No se encontraron productos");
        //        }

        //        var peliculasDto = productos.Select(p => _mapper.Map<ProductoDto>(p)).ToList();

        //        var response = new
        //        {
        //            PageNumber = pageNumber,
        //            PageSize = pageSize,
        //            TotalPages = (int)Math.Ceiling(totalProductos / (double)pageSize),
        //            TotalItems = totalProductos,
        //            Items = peliculasDto
        //        };

        //        return Ok(response);

        //    }
        //    catch (Exception)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, "Error recuperando datos de la aplicacion");
        //    }
        //}

        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProductos()
        {
            try
            {
                var productosDto = await _prodRepo.GetProductos();

                if (productosDto == null || !productosDto.Any())
                {
                    var errores = new List<string> { "No se encontraron productos" };
                    return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
                }

                return Ok(RespuestaApi<object>.Success(productosDto));

            }
            catch (Exception)
            {
                var errores = new List<string> { "Error recuperando datos de la aplicacion" };
                return StatusCode(StatusCodes.Status500InternalServerError, RespuestaApi<string>.Error(errores, HttpStatusCode.InternalServerError));
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("admin/productosInactivos", Name = "GetProductosInactivos")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductosInactivos()
        {
            try
            {
                var productosDto = await _prodRepo.GetProductosInactivos();

                if (productosDto == null || !productosDto.Any())
                {
                    var errores = new List<string> { "No se encontraron productos" };
                    return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
                }

                return Ok(RespuestaApi<object>.Success(productosDto));

            }
            catch (Exception)
            {
                var errores = new List<string> { "Error recuperando datos de la aplicacion" };
                return StatusCode(StatusCodes.Status500InternalServerError, RespuestaApi<string>.Error(errores, HttpStatusCode.InternalServerError));
            }
        }



        [Authorize(Roles = "Vendedor")]
        [HttpGet("vendedor/{nombreVendedor}", Name = "GetProductosVendedor")]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProductosVendedor(string nombreVendedor)
        {
            if (string.IsNullOrEmpty(nombreVendedor))
            {
                var errores = new List<string> { "El nombre del vendedor no puede estar vacío" };
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            var productosVendedor = await _prodRepo.GetProductosVendedor(nombreVendedor);

            return Ok(RespuestaApi<object>.Success(productosVendedor));
        }

       

        [AllowAnonymous]
        [HttpGet("{productoId:int}", Name = "GetProducto")] 
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProducto(int productoId)
        {
            var itemProducto = await _prodRepo.GetProducto(productoId);

            //Validamos si existe
            if (itemProducto == null)
            {
                var errores = new List<string> { $"El producto con Id: {productoId} no existe" };
                return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
            }

            var itemProductoDto = _mapper.Map<ProductoDto>(itemProducto);

            return Ok(RespuestaApi<object>.Success(itemProductoDto));
        }

       
        [Authorize(Roles = "Vendedor")]
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(ProductoDto))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        //FromForm: Indica que los datos vienen desde un formulario HTML
        public IActionResult CrearProducto([FromForm] CrearProductoDto crearProductoDto)
        {
            if (!ModelState.IsValid)
            {
                var errores = ExtraerErroresModelState.Extraer(ModelState);
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            // Obtenemos el ID del usuario que está autenticado
            var usuarioId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(usuarioId))
            {
                var errores = new List<string> { "Usuario no autenticado" };
                return Unauthorized(RespuestaApi<string>.Error(errores, HttpStatusCode.Unauthorized));
            }

            

            // Usa el repositorio (_ctRepo) para verificar si ya existe una categoría con ese nombre
            if (_prodRepo.ExisteProducto(crearProductoDto.Nombre))
            {
                var errores = new List<string> { "El producto ya existe" };
                return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
            }

            // _mapper: Convierte el DTO a una entidad Producto.
            var producto = _mapper.Map<Producto>(crearProductoDto);
            producto.UsuarioId = usuarioId;


            //Subida de archivo
            if (crearProductoDto.Imagen != null)
            {
                //Construimos el nombre del archivo
                string nombreArchivo = producto.Id + Guid.NewGuid().ToString() + Path.GetExtension(crearProductoDto.Imagen.FileName);
                string rutaArchivo = @"wwwroot\ImagenesProductos\" + nombreArchivo;

                var ubicacionDirectorio = Path.Combine(Directory.GetCurrentDirectory(), rutaArchivo);

                FileInfo file = new FileInfo(ubicacionDirectorio);

                if (file.Exists)
                {
                    file.Delete();
                }

                //Enviamos el archivo a la carpeta
                using (var fileStream = new FileStream(ubicacionDirectorio, FileMode.Create))
                {
                    crearProductoDto.Imagen.CopyTo(fileStream);
                }

                //Aqui construimos la ruta de la imagen
                var baseUrl = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.Value}{HttpContext.Request.PathBase.Value}";
                producto.ImagenUrl = baseUrl + "/ImagenesProductos/" + nombreArchivo;
                producto.RutaLocalImagen = rutaArchivo; // Guardamos la ruta local del archivo
            }
            else
            {
                producto.ImagenUrl = "https://placehold.co/600x400"; // Ruta por defecto si no se proporciona una imagen
            }

            _prodRepo.CrearProducto(producto);

            var productoDto = _mapper.Map<ProductoDto>(producto);

            return CreatedAtRoute("GetProducto", new { productoId = producto.Id }, 
                RespuestaApi<object>.Success(productoDto, HttpStatusCode.Created));

            //CreatedAtRoute(string routeName, object routeValues, [ActionResultObjectValue] object value);
            //Qué hace cada parámetro:
            //        routeName: Nombre de la ruta(ej: "GetProducto").

            //        routeValues: Valores para generar la URL(ej: new { productoId = producto.Id }).

            //        value: El objeto que se incluirá en el cuerpo de la respuesta HTTP(ej: producto).

        }


        [Authorize(Roles = "Vendedor")]
        [HttpPatch("editar/{productoId:int}", Name = "EditarProducto")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> EditarProducto(int productoId, [FromBody] ActualizarProductoDto actualizarProductoDto)
        {

            if (!ModelState.IsValid)
            {
                var errores = new List<string> { "No se puede editar el producto" };
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            //Comprueba si se recibió un objeto válido.
            
            if (actualizarProductoDto == null || productoId != actualizarProductoDto.Id)
            {
                var errores = new List<string> { "El objeto recibido no es valido" };
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

        
            var productoExistente = await _prodRepo.GetProducto(productoId);

            if (productoExistente == null)
            {
                
                var errores = new List<string> { $"No se encontro el producto con ID: {productoId}" };
                return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
            }

            await _prodRepo.ActualizarProducto(actualizarProductoDto);
            
            return NoContent();
        }



        [Authorize(Roles = "Vendedor")]
        [HttpPatch("borrar/{productoId:int}", Name = "BorrarProducto")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> BorrarProducto(int productoId)
        {
            if (!_prodRepo.ExisteProducto(productoId)) 
            {
                var errores = new List<string> { "Producto no encontrado" };
                return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
            }

            var productoDto = await _prodRepo.GetProducto(productoId);

            if (!await _prodRepo.BorrarProducto(productoId)) 
            {
                var errores = new List<string> { $"Algo salió mal borrando el producto {productoDto.Nombre}" };
                return StatusCode(StatusCodes.Status500InternalServerError, RespuestaApi<string>.Error(errores, HttpStatusCode.InternalServerError)); 
            }

            return NoContent(); // 204 - Eliminado correctamente
        }


        //Le tengo que poner [FromQuery] ya que sino me colisiona con el enpoint get que no tiene parametro
        //entonces este endpoint es asi: https://localhost:7162/api/productos/buscar?nombre=monitor
        //esto quiere decir que le mandas el valor "monitor" al parametro llamado nombre

        [AllowAnonymous]
        [HttpGet("buscar", Name = "BuscarProductos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> BuscarProductos([FromQuery]string nombre)
        {
            try
            {
                var producto = await _prodRepo.BuscarProductos(nombre);
                if (!producto.Any())
                {
                    var errores = new List<string> { "No se encontraron productos que coincidan con los criterios de busqueda" };
                    return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
                }

                return Ok(RespuestaApi<object>.Success(producto));
            }
            catch(Exception)
            {
                var errores = new List<string> { "Error recuperando datos de la aplicacion" };
                return StatusCode(StatusCodes.Status500InternalServerError, RespuestaApi<string>.Error(errores, HttpStatusCode.InternalServerError));
            }

        }
    }
}
