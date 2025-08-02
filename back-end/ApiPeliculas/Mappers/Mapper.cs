using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Base.Dtos;
using ApiPeliculas.Modelos.Dto.DtoProductos;
using ApiPeliculas.Modelos.Dto.DtoUsuarios;
using ApiPeliculas.Modelos.Dto.DtoVentas;
using AutoMapper;

namespace ApiPeliculas.Mappers
{
    public class Mapper: Profile
    {
        public Mapper() 
        {
            CreateMap<ApplicationUser, UsuarioDto>().ReverseMap();
            CreateMap<ApplicationUser, UsuarioDatosDto>().ReverseMap();
            CreateMap<Producto, ActualizarProductoDto>().ReverseMap();
            CreateMap<Producto, ProductoDto>().ReverseMap();
            CreateMap<Producto, CrearProductoDto>().ReverseMap();
            CreateMap<Venta, VentaDto>()
                .ForMember(d => d.CompradorNombre, o => o.MapFrom(src => src.Usuario.NombreCompleto));
            CreateMap<DetalleVenta, DetalleVentaRespuestaDto>()
                .ForMember(d => d.NombreProducto, o => o.MapFrom(src => src.Producto.Nombre))
                .ForMember(dest => dest.NombreVendedor, opt => opt.MapFrom(src => src.Producto.Usuario.NombreCompleto));
        }
    }
}
