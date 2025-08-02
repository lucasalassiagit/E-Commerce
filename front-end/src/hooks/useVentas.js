import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

//Sirve para mostrar ventas y compras de los usuarios
export const useVentas = (apiUrl, token) => {
  const [ventas, setVentas] = useState([]);
  const [load, setLoading] = useState(true);
  const [err, setError] = useState(null);

  const configToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const getVentas = async () => {
      try {
        const response = await axios.get(apiUrl, configToken);
        setVentas(response.data.result);
      } catch (err) {
        setError(err);
        console.error("Hubo un error", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getVentas();
    }
  }, [apiUrl, token]);

  return { ventas, load, err };
};
