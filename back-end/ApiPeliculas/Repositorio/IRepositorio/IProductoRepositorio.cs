using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Base.Dtos;
using ApiPeliculas.Modelos.Dto.DtoProductos;

namespace ApiPeliculas.Repositorio.IRepositorio
{
    public interface IProductoRepositorio
    {

        // Metodo para obtener una lista de productos con paginación, lo dejamos para despues
        //ICollection<ProductoDto> GetProductos(int pageNumber, int pageSize);

        Task<ICollection<ProductoDto>> GetProductos();
        Task<int> getTotalProductos();
        Task<IEnumerable<ProductoDto>> BuscarProductos(string nombre);
        Task<ProductoDto> GetProducto(int productoId);
        Task<ICollection<ProductoDto>> GetProductosInactivos();
        Task<ICollection<ProductoDto>> GetProductosVendedor(string nombreVendedor);
        bool ExisteProducto(int id);
        bool ExisteProducto(string nombre);
        Task<bool> CrearProducto(Producto producto);
        Task<bool> ActualizarProducto(ActualizarProductoDto actualizarProductoDto);
        Task<bool> BorrarProducto(int productoId);
        Task<bool> Guardar();
    }
}
