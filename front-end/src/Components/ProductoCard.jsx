import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
} from "@mui/material";

export const ProductoCard = ({ producto }) => {
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
          paddingTop: "56.25%", // Relación de aspecto 16:9
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
            objectFit: "contain", // Cambiado de 'cover' a 'contain' para ver toda la imagen
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

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={`$${producto.precio}`} color="primary" size="small" />
          <Chip
            label={`Stock: ${producto.stock}`}
            variant="outlined"
            size="small"
          />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          Vendedor: {producto.nombreVendedor}
        </Typography>
      </CardContent>
    </Card>
  );
};
