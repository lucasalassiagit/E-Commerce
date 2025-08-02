import { useEffect, useState } from "react";
import axios from "axios";

export const useProductosVendedor = (
  url,
  token,
  nombreVendedor,
  recargarProductos
) => {
  const [productosVendedor, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const urlConVendedor = `${url}/${nombreVendedor}`;
  const configToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getProductosVendedor = async () => {
      try {
        const response = await axios.get(urlConVendedor, configToken);
        setProductos(response.data.result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getProductosVendedor();
  }, [url, token, nombreVendedor, recargarProductos]);

  return { productosVendedor, loading, error };
};
