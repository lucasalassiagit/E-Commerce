// hooks/useLoginPost.js
import { useState } from "react";
import axios from "axios";

export const useLoginPost = (url) => {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null); // ✅ Este será el mensaje a mostrar

  const postData = async (payload) => {
    setCargando(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // ✅ Si la respuesta tiene IsSuccess: false, también es un error
      const responseData = response.data;
      if (
        responseData.IsSuccess === false &&
        responseData.ErrorMessages?.length > 0
      ) {
        const errorMsg = responseData.ErrorMessages[0];
        setError(errorMsg);
        return Promise.reject(new Error(errorMsg)); // opcional: para que el caller lo sepa
      }

      setData(responseData);
      return responseData;
    } catch (err) {
      console.error("Error completo:", err);

      // ✅ Extraemos el mensaje del backend estructurado
      const errorData = err.response?.data;

      if (errorData?.ErrorMessages && Array.isArray(errorData.ErrorMessages)) {
        const errorMsg = errorData.ErrorMessages[0];
        setError(errorMsg);
      } else if (err.response?.status === 400) {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError("Error de conexión con el servidor");
      }
    } finally {
      setCargando(false);
    }
  };

  return { postData, cargando, data, error }; // ✅ Exponemos el error
};
