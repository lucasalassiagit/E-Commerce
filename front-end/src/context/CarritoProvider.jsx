import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "./AuthProvider";

const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const { usuario } = useAuth();

  const claveCarrito = usuario
    ? `carrito_${usuario.username}`
    : "carrito_invitado";

  const [carrito, setCarrito] = useLocalStorage(claveCarrito, []);

  const agregarProducto = (producto) => {
    const yaAgregado = carrito.some((p) => p.id === producto.id);
    if (!yaAgregado) {
      const productoConCantidad = { ...producto, cantidad: 1 };
      setCarrito([...carrito, productoConCantidad]);
    }
  };

  const eliminarProducto = (idProducto) => {
    const nuevoCarrito = carrito.filter((p) => p.id !== idProducto);
    setCarrito(nuevoCarrito);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const estaEnCarrito = (idProducto) => {
    return Array.isArray(carrito) && carrito.some((p) => p.id === idProducto);
  };

  const actualizarCantidad = (idProducto, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((prod) =>
        prod.id === idProducto ? { ...prod, cantidad: nuevaCantidad } : prod
      )
    );
  };

  const incrementarCantidad = (idProducto) => {
    setCarrito((prev) =>
      prev.map((prod) =>
        prod.id === idProducto && prod.cantidad < prod.stock
          ? { ...prod, cantidad: prod.cantidad + 1 }
          : prod
      )
    );
  };

  const decrementarCantidad = (idProducto) => {
    setCarrito((prev) =>
      prev.map((prod) =>
        prod.id === idProducto && prod.cantidad > 1
          ? { ...prod, cantidad: prod.cantidad - 1 }
          : prod
      )
    );
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        eliminarProducto,
        vaciarCarrito,
        estaEnCarrito,
        actualizarCantidad,
        incrementarCantidad,
        decrementarCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => useContext(CarritoContext);
