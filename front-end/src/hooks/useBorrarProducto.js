import axios from "axios";

export const useBorrarProducto = () => {
  const borrarProducto = async (url, productoId, token) => {
    const urlEliminar = `${url}/${productoId}`;

    try {
      const response = await axios.patch(urlEliminar, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  };

  return { borrarProducto };
};
