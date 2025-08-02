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

namespace ApiPeliculas.Controllers.Base.V1
{
    [Route("api/ventas")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IVentaRepositorio _ventRepo;
        private readonly IMapper _mapper;

        public VentasController(IVentaRepositorio ventRepo, IMapper mapper)
        {
            _ventRepo = ventRepo;
            _mapper = mapper;
        }

       
        [Authorize(Roles = "Comprador")]
        [HttpPost]
        [ProducesResponseType(201, Type = typeof(ProductoDto))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult CrearVenta([FromBody] CrearVentaDto crearVentaDto)
        {
            if (!ModelState.IsValid)
            {
                var errores = ExtraerErroresModelState.Extraer(ModelState);
                return BadRequest(RespuestaApi<string>.Error(errores));
            }

            var resultado = _ventRepo.CrearVenta(crearVentaDto);

            if (!resultado)
            {
                var errores = new List<string> { "Error al guardar la venta" };
                return StatusCode(StatusCodes.Status500InternalServerError,RespuestaApi<string>.Error(errores, HttpStatusCode.InternalServerError));
                
            }

            return StatusCode(StatusCodes.Status201Created, RespuestaApi<string>.Success("Venta creada con exito", HttpStatusCode.Created));
        }



        [Authorize(Roles = "Admin")]
        [HttpGet("GetVentasyCompras")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetVentasyCompras()
        {
            var ventasDto = _ventRepo.GetVentas();
            if (ventasDto == null || !ventasDto.Any())
            {
                var errores = new List<string> { "No se encontraron ventas" };
                return Ok(RespuestaApi<object>.Success(new List<VentaDto>()));
            }

            return Ok(RespuestaApi<object>.Success(ventasDto));
        }

        //Compras realizadas por un comprador

        [Authorize(Roles = "Comprador")]
        [HttpGet("GetComprasRealizadas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetComprasRealizadas()
        {
            var compradorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(compradorId))
            {
                var errores = new List<string> { "Usuario no autenticado" };
                return Unauthorized(RespuestaApi<string>.Error(errores, HttpStatusCode.Unauthorized));
                
            }
            var compras = _ventRepo.GetVentasPorComprador(compradorId);
            

            if (compras == null || !compras.Any())
            {
                var errores = new List<string> { "No se encontraron compras realizadas por el comprador" };
                return NotFound(RespuestaApi<string>.Error(errores, HttpStatusCode.NotFound));
                
            }

            var comprasDto = _mapper.Map<IEnumerable<VentaDto>>(compras);

            return Ok(RespuestaApi<object>.Success(comprasDto));
        }

        //Ventas realizadas por un vendedor
        [Authorize(Roles = "Vendedor")]
        [HttpGet("GetVentasRealizadas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public IActionResult GetVentasRealizadas()
        {
            var vendedorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(vendedorId))
            {
                var errores = new List<string> { "Usuario no autenticado" };
                return Unauthorized(RespuestaApi<string>.Error(errores, HttpStatusCode.Unauthorized));
            }
            var ventas = _ventRepo.GetVentasPorVendedor(vendedorId);
            
            if (ventas == null || !ventas.Any())
            {
                return Ok(RespuestaApi<object>.Success(new List<VentaDto>()));
            }

            var ventasDto = _mapper.Map<IEnumerable<VentaDto>>(ventas);

            return Ok(RespuestaApi<object>.Success(ventasDto));
        }

    }
}
