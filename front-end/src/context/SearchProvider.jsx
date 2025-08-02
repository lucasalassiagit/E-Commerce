import { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext(); //aca nace el contexto

export const SearchProvider = ({ children }) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [busquedaActual, setBusquedaActual] = useState("");
  const [notificacionCarrito, setNotificacionCarrito] = useState(0);

  // Sincroniza cuando terminoBusqueda cambie
  useEffect(() => {
    setBusquedaActual(terminoBusqueda);
  }, [terminoBusqueda]);

  // Función para limpiar completamente la búsqueda (agregada)
  const limpiarBusqueda = () => {
    setTerminoBusqueda("");
    setBusquedaActual("");
  };

  return (
    <SearchContext.Provider
      value={{
        terminoBusqueda,
        setTerminoBusqueda,
        busquedaActual,
        notificacionCarrito,
        setNotificacionCarrito,
        limpiarBusqueda,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

//custom hook para acceder al contexto sin repetir useContext a mano.

export const useSearch = () => useContext(SearchContext);
