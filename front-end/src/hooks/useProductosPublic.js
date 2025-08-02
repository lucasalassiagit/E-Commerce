import { useEffect, useState } from "react";
import axios from "axios";

export const useProductosPublic = (apiUrl, terminoBusqueda) => {
  const [productos, setProductos] = useState([]);
  const [loadi, setLoading] = useState(true);
  const [er, setError] = useState(null);

  useEffect(() => {
    const getProductosPublic = async () => {
      try {
        setLoading(true);
        setError(null); // Reiniciamos errores previos

        //encodeURIComponent asegura que caracteres como espacios, acentos, etc., no rompan la URL.

        const urlBusqueda = terminoBusqueda
          ? `${apiUrl}/buscar?nombre=${encodeURIComponent(terminoBusqueda)}`
          : apiUrl;

        console.log("Llamando a:", urlBusqueda); // Para debug

        const response = await axios.get(urlBusqueda);
        setProductos(response.data.result || response.data); // Más flexible
      } catch (err) {
        setError(err);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      getProductosPublic();
    }, 300); // Debounce para evitar múltiples llamadas

    return () => clearTimeout(timer);
  }, [apiUrl, terminoBusqueda]);

  return { productos, loadi, er };
};
