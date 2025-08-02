// useRegistroPost.js
import { useState } from "react";
import axios from "axios";

export const useRegistroPost = (url) => {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (payload) => {
    setCargando(true);
    setError(null);
    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setData(response.data);
      return response.data;
    } catch (err) {
      // Captura errores del backend (valores en errors o errorMessages)
      setError(err.response?.data || { message: "Error desconocido" });
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { postData, error, cargando, data };
};
