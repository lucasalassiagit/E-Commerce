import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Divider,
  Badge,
  useTheme,
} from "@mui/material";
import { useCarrito } from "../context/CarritoProvider";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";

export const ProductoCardComprador = ({ producto }) => {
  const { agregarProducto, estaEnCarrito } = useCarrito();
  const theme = useTheme();

  const yaAgregado = estaEnCarrito(producto.id);
  const agotado = producto.stock <= 0;

  return (
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
        {agotado && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chip
              label="AGOTADO"
              color="error"
              size="medium"
              sx={{ fontWeight: "bold" }}
            />
          </Box>
        )}
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

        <Typography variant="caption" color="text.secondary">
          Vendedor: {producto.nombreVendedor}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={
            agotado ? (
              <DoNotDisturbOnIcon />
            ) : yaAgregado ? (
              <CheckCircleIcon />
            ) : (
              <ShoppingCartIcon />
            )
          }
          onClick={() => !agotado && !yaAgregado && agregarProducto(producto)}
          disabled={yaAgregado || agotado}
          sx={{
            backgroundColor: agotado
              ? theme.palette.grey[500]
              : yaAgregado
              ? theme.palette.success.main
              : theme.palette.primary.main,
            "&:hover": {
              backgroundColor: agotado
                ? theme.palette.grey[600]
                : yaAgregado
                ? theme.palette.success.dark
                : theme.palette.primary.dark,
            },
          }}
        >
          {agotado
            ? "Agotado"
            : yaAgregado
            ? "En el carrito"
            : "Agregar al carrito"}
        </Button>
      </CardActions>
    </Card>
  );
};
