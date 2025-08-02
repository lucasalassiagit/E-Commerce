import { useBorrarProducto } from "../hooks/useBorrarProducto";
import { useAuth } from "../context/AuthProvider";
import { ModalEditarProducto } from "./ModalEditarProducto";
import { useState } from "react";
import { useEditarProducto } from "../hooks/useEditarProducto";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  Divider,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProductoCardVendedor = ({ producto, onRecargar }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { borrarProducto } = useBorrarProducto();
  const { usuario } = useAuth();
  const { editarProducto } = useEditarProducto();
  const theme = useTheme();

  const onBorrar = async () => {
    try {
      await borrarProducto(
        "https://localhost:7162/api/productos/borrar",
        producto.id,
        usuario.token
      );
      onRecargar();
    } catch (error) {
      console.error("Error al borrar el producto:", error);
      throw error; // Puedes manejar esto con un snackbar/alert en el componente padre
    }
  };

  const onEditar = () => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const handleGuardarCambios = async (productoEditado) => {
    try {
      await editarProducto(
        "https://localhost:7162/api/productos/editar",
        productoEditado.id,
        usuario.token,
        productoEditado
      );
      setModalOpen(false);
      onRecargar();
    } catch (err) {
      console.error("Error al editar:", err);
      throw err;
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          m: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: 4,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            paddingTop: "56.25%", // 16:9 aspect ratio
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            image={producto.imagenUrl}
            alt={producto.nombre}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              backgroundColor: "#f5f5f5",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h3" noWrap>
            {producto.nombre}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            paragraph
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {producto.descripcion}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label={`$${producto.precio}`} color="primary" size="small" />
            <Chip
              label={`Stock: ${producto.stock}`}
              variant="outlined"
              size="small"
              color={producto.stock > 0 ? "success" : "error"}
            />
          </Stack>
        </CardContent>

        <Box sx={{ p: 1.5, pt: 0 }}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={onEditar}
              fullWidth
              sx={{
                backgroundColor: theme.palette.success.main,
                "&:hover": {
                  backgroundColor: theme.palette.success.dark,
                },
              }}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
              fullWidth
              sx={{
                backgroundColor: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.error.dark,
                },
              }}
            >
              Borrar
            </Button>
          </Stack>
        </Box>
      </Card>

      <ModalEditarProducto
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        producto={productoSeleccionado}
        onGuardar={handleGuardarCambios}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro que deseas eliminar el producto "{producto.nombre}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancelar</Button>
          <Button
            onClick={() => {
              handleDeleteClose();
              onBorrar();
            }}
            color="error"
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
