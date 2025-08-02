import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Badge,
  Box,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const ProductoCardBorrado = ({ producto }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Badge
        badgeContent="Eliminado"
        color="error"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiBadge-badge": {
            top: 16,
            left: 16,
            fontSize: "0.75rem",
            padding: "4px 8px",
          },
        }}
      >
        <Card
          sx={{
            opacity: 0.6,
            backgroundColor: "#f5f5f5",
            boxShadow: 3,
          }}
        >
          <CardMedia
            component="img"
            height="200"
            image={producto.imagenUrl}
            alt={producto.nombre}
            sx={{ objectFit: "cover" }}
          />
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {producto.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Descripción: {producto.descripcion}
            </Typography>
            <Typography variant="body2" color="error">
              Precio: <del>${producto.precio}</del>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stock: {producto.stock}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vendedor: {producto.nombreVendedor}
            </Typography>
          </CardContent>
        </Card>
      </Badge>
    </Grid>
  );
};
