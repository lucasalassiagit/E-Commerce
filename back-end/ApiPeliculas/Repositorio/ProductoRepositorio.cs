using ApiPeliculas.Data;
using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Base.Dtos;
using ApiPeliculas.Modelos.Dto.DtoProductos;
using ApiPeliculas.Repositorio.IRepositorio;
using AutoMapper;
using Humanizer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Runtime.InteropServices;
using static System.Net.WebRequestMethods;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ApiPeliculas.Repositorio
{
    public class ProductoRepositorio : IProductoRepositorio
    {
        private readonly AppDbContext _bd;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _usManager;

        public ProductoRepositorio(AppDbContext bd, IMapper mapper, UserManager<ApplicationUser> usManager)
        {
            _bd = bd;
            _mapper = mapper;
            _usManager = usManager;
        }

        public async Task <bool> ActualizarProducto(ActualizarProductoDto actualizarProductoDto)
        {
            var productoExistente = await _bd.Producto.FindAsync(actualizarProductoDto.Id);

            if (productoExistente == null)
            {
                return false; // o lanzar una excepción si preferís
            }

            // Solo actualizamos los campos que vienen con datos
            if (!string.IsNullOrWhiteSpace(actualizarProductoDto.Nombre))
                productoExistente.Nombre = actualizarProductoDto.Nombre;

            if (!string.IsNullOrWhiteSpace(actualizarProductoDto.Descripcion))
                productoExistente.Descripcion = actualizarProductoDto.Descripcion;

            if (actualizarProductoDto.Precio.HasValue)
                productoExistente.Precio = actualizarProductoDto.Precio.Value;

            if (actualizarProductoDto.Stock.HasValue)
                productoExistente.Stock = actualizarProductoDto.Stock.Value;

            return await Guardar();
        }


        public async Task<bool> BorrarProducto(int productoId)
        {
            var productoEliminar = await _bd.Producto.FirstOrDefaultAsync(p => p.Id == productoId);
            if(productoEliminar == null)
            {
                return false; // o lanzar una excepción si preferís
            }

            productoEliminar.Estado = false; // Cambiamos el estado a false en vez de eliminarlo físicamente

            return await Guardar();
        }

        public async Task<IEnumerable<ProductoDto>> BuscarProductos(string nombre)
        {

            // ?? operador de fusion nula
            // si nombre no es null se ejecuta .ToLower()
            // si nombre es null se ejecutar string.Empty

            var nombreFormateado = nombre?.ToLower() ?? string.Empty;

            // Consulta productos activos que coincidan con el nombre o descripción
            var query = await _bd.Producto
                .Where(p => p.Estado == true &&
                    (string.IsNullOrEmpty(nombreFormateado) ||
                     p.Nombre.ToLower().Contains(nombreFormateado)))
                .ToListAsync();

            // Obtenemos solo los IDs unicos de usuarios usados
            var usuariosIds = query.Select(p => p.UsuarioId).Distinct().ToList();


            // Traemos solo los usuarios necesarios
            var usuarios = await _usManager.Users
                .Where(u => usuariosIds.Contains(u.Id))
                .ToListAsync();

            // Creamos los DTOs incluyendo el nombre del vendedor
            var productosDto = query.Select(p =>
            {
                var dto = _mapper.Map<ProductoDto>(p);
                var usuario = usuarios.FirstOrDefault(u => u.Id == p.UsuarioId);
                dto.NombreVendedor = usuario?.NombreCompleto ?? "Desconocido";
                return dto;
            });

            return productosDto;
        }

        public async Task<bool> CrearProducto(Producto producto)
        {
            await _bd.Producto.AddAsync(producto);
            return await Guardar();
        }

        public bool ExisteProducto(int id)
        {
            return _bd.Producto.Any(c => c.Id == id);
        }

        public bool ExisteProducto(string nombre)
        {
            bool valor = _bd.Producto.Any(c => c.Nombre.ToLower().Trim() == nombre.ToLower().Trim());
            return valor;
        }


        //Para que solo me traiga los productos de ese vendedor
        public async Task<ICollection<ProductoDto>> GetProductosVendedor(string nombreVendedor)
        {
            var productosVendedor = new List<Producto>();
            var idVendedor = await _usManager.Users
                .Where(u => u.UserName == nombreVendedor)   //cambie NombreCompleto por UserName
                .Select(u => u.Id)
                .FirstOrDefaultAsync();

            //Validacion por si el vendedor no existe
            if (string.IsNullOrEmpty(idVendedor))
                return new List<ProductoDto>(); 

            productosVendedor = await _bd.Producto
                .Where(p => p.UsuarioId == idVendedor && p.Estado == true) // Solo productos activos
                .OrderBy(p => p.Nombre)
                .ToListAsync();

            var nombreVend = await _usManager.Users
                .Where(u => u.Id == idVendedor)
                .Select(u => u.NombreCompleto)
                .FirstOrDefaultAsync();

            var productosVendedorDto = _mapper.Map<ICollection<ProductoDto>>(productosVendedor);

            foreach(var nomb in productosVendedorDto)
            {
                nomb.NombreVendedor = nombreVend; // Asignamos el nombre del vendedor a cada producto
            }


            return productosVendedorDto;
        }


        public async Task<ProductoDto> GetProducto(int id)
        {
            var producto =  await _bd.Producto.FirstOrDefaultAsync(c => c.Id == id);

            var productoDto = _mapper.Map<ProductoDto>(producto);

            return productoDto;
        }


        // Paginacion en el back la dejo para despues

        //public ICollection<ProductoDto> GetProductos(int pageNumber, int pageSize)
        //{
        //    var producto =  _bd.Producto.OrderBy(c => c.Nombre)
        //        .Skip((pageNumber - 1) * pageSize) // Salta los elementos de las paginas anteriores
        //        .Take(pageSize) // Toma el numero de elementos que le digamos
        //        .ToList();
        //    return _mapper.Map<ICollection<ProductoDto>>(producto);
        //}

        public async Task<ICollection<ProductoDto>> GetProductos()
        {
            var productos = await _bd.Producto
                .Where(c => c.Estado)   //solo se devuelven los productos con estado true
                .OrderBy(c => c.Nombre)
                .ToListAsync();

            var usuarios = await _usManager.Users.ToListAsync(); // Traés todos los usuarios

            var productosDto = productos.Select(p =>
            {
                var dto = _mapper.Map<ProductoDto>(p);
                var usuario = usuarios.FirstOrDefault(u => u.Id == p.UsuarioId);
                if (usuario != null)
                {
                    dto.NombreVendedor = usuario.NombreCompleto;
                }
                return dto;
            }).ToList();

            return productosDto;
        }

        public async Task<ICollection<ProductoDto>> GetProductosInactivos()
        {
            var productos = await _bd.Producto
                .Where(c => c.Estado == false)   //solo se devuelven los productos con estado false
                .OrderBy(c => c.Nombre)
                .ToListAsync();

            var usuarios = await _usManager.Users.ToListAsync(); // Traés todos los usuarios

            var productosDto = productos.Select(p =>
            {
                var dto = _mapper.Map<ProductoDto>(p);
                var usuario = usuarios.FirstOrDefault(u => u.Id == p.UsuarioId);
                if (usuario != null)
                {
                    dto.NombreVendedor = usuario.NombreCompleto;
                }
                return dto;
            }).ToList();

            return productosDto;
        }


        public async Task<int> getTotalProductos()
        {
            return await _bd.Producto.CountAsync();
        }

        public async Task<bool> Guardar()
        {
            return await _bd.SaveChangesAsync() >= 0 ? true : false;   
        }

    }
}
