import { useEffect, useState } from "react";
import axios from "axios";

export const useProductosBorrados = (apiUrl, token, recargarProductos) => {
  const [productosBorrados, setProductos] = useState([]);
  const [load, setLoading] = useState(true);
  const [err, setError] = useState(null);

  const configToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getProductosPublic = async () => {
      try {
        const response = await axios.get(apiUrl, configToken);
        setProductos(response.data.result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getProductosPublic();
  }, [apiUrl, token, recargarProductos]);

  return { productosBorrados, load, err };
};
