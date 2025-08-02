import axios from "axios";

export const useEditarProducto = () => {
  const editarProducto = async (url, productoId, token, producto) => {
    const urlEditar = `${url}/${productoId}`;

    try {
      const response = await axios.patch(urlEditar, producto, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  };

  return { editarProducto };
};
