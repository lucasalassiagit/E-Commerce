using ApiPeliculas.Data;
using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Dto.DtoProductos;
using ApiPeliculas.Modelos.Dto.DtoVentas;
using ApiPeliculas.Repositorio.IRepositorio;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

namespace ApiPeliculas.Repositorio
{
    public class VentaRepositorio : IVentaRepositorio
    {
        private readonly AppDbContext _db;
        private readonly UserManager<ApplicationUser> _usManager;
        private readonly IMapper _mapper;
        public VentaRepositorio(AppDbContext db, UserManager<ApplicationUser> usManager, IMapper mapper)
        {
            _db = db;
            _usManager = usManager;
            _mapper = mapper;
        }

        public bool CrearVenta(CrearVentaDto crearVentaDto)
        {
            var detalles = new List<DetalleVenta>();

            foreach (var item in crearVentaDto.Detalles)
            {
                var producto = _db.Producto.FirstOrDefault(p => p.Id == item.ProductoId);
                if(producto == null || producto.Stock < item.Cantidad)
                {
                    return false;
                }

                producto.Stock -= item.Cantidad;

                detalles.Add(new DetalleVenta
                {
                    ProductoId = item.ProductoId,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = producto.Precio,
                    
                });

            }


            var venta = new Venta
            {
                Fecha = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                UsuarioId = crearVentaDto.UsuarioId,
                Detalles = detalles,
                Total = detalles.Sum(d => d.Cantidad * d.PrecioUnitario)
            };
          
            _db.Venta.Add(venta);

            return GuardarVenta();
        }


        public Venta GetVenta(int ventaId)
        {
            return _db.Venta
                .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
                .FirstOrDefault(v => v.Id == ventaId);
        }

        //El admin puede ver ventas y compras
        public IEnumerable<VentaDto> GetVentas()
        {
            var ventas =  _db.Venta
                .Include(v => v.Usuario)
                .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
                .ThenInclude(d => d.Usuario)
                .ToList();

            var ventasDto = _mapper.Map<IEnumerable<VentaDto>>(ventas);

            return ventasDto;
        }

        //El comprador puede ver sus compras
        public IEnumerable<Venta> GetVentasPorComprador(string compradorId)
        {
            return _db.Venta
                .Include(u => u.Usuario)  //comprador
                .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
                .ThenInclude(p => p.Usuario)  //vendedor
                
                .Where(v => v.UsuarioId == compradorId)
                .ToList();
        }

        //El vendedor puede ver sus ventas
        public IEnumerable<Venta> GetVentasPorVendedor(string vendedorId)
        {
            
            var ventas = _db.Venta
                    .Include(v => v.Usuario)
                    .Include(v => v.Detalles)
                    .ThenInclude(d => d.Producto)
                    .ThenInclude(p => p.Usuario)
                    .ToList();

            // Filtrar los detalles de cada venta para que solo queden los productos del vendedor actual
            foreach (var venta in ventas)
            {
                venta.Detalles = venta.Detalles
                    .Where(d => d.Producto.UsuarioId == vendedorId)
                    .ToList();
            }

            // Luego, eliminar las ventas que quedaron sin detalles
            ventas = ventas
                .Where(v => v.Detalles.Any())
                .ToList();

            return ventas;

        }


        public bool GuardarVenta()
        {
            return _db.SaveChanges() >= 0 ? true : false;
        }

        
    }
}
