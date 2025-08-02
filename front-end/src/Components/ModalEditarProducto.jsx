import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

export const ModalEditarProducto = ({ open, onClose, producto, onGuardar }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
      setPrecio(producto.precio);
      setStock(producto.stock);
    }
  }, [producto]);

  const handleGuardar = () => {
    const productoEditado = {
      ...producto,
      nombre,
      descripcion,
      precio,
      stock,
    };
    onGuardar(productoEditado);
    onClose(); // cerrar modal
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          fullWidth
          margin="normal"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <TextField
          label="Descripción"
          fullWidth
          margin="normal"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <TextField
          label="Precio"
          type="number"
          fullWidth
          margin="normal"
          value={precio}
          onChange={(e) => setPrecio(Number(e.target.value))}
        />
        <TextField
          label="Stock"
          type="number"
          fullWidth
          margin="normal"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleGuardar} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};
