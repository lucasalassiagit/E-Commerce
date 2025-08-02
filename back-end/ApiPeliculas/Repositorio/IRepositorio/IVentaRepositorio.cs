using ApiPeliculas.Modelos;
using ApiPeliculas.Modelos.Dto.DtoVentas;

namespace ApiPeliculas.Repositorio.IRepositorio
{
    public interface IVentaRepositorio
    {
        IEnumerable<VentaDto> GetVentas();

        IEnumerable<Venta> GetVentasPorComprador(string compradorId);

        IEnumerable<Venta> GetVentasPorVendedor(string vendedorId);

        public Venta GetVenta(int ventaId);

        public bool CrearVenta(CrearVentaDto crearVentaDto);


        bool GuardarVenta();
    }
}
