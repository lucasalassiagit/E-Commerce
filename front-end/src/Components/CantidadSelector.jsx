import { Box, Button, TextField } from "@mui/material";

export const CantidadSelector = ({
  cantidad,
  stock,
  onIncrementar,
  onDecrementar,
  onCambiarCantidad,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Button
        variant="outlined"
        onClick={onDecrementar}
        disabled={cantidad <= 1}
      >
        -
      </Button>

      <TextField
        type="number"
        value={cantidad}
        inputProps={{
          min: 1,
          max: stock,
          style: { textAlign: "center" },
        }}
        size="small"
        sx={{ width: 60 }}
        onChange={(e) => {
          const value = parseInt(e.target.value) || 1;
          const nuevaCantidad = Math.max(1, Math.min(stock, value));
          onCambiarCantidad(nuevaCantidad);
        }}
      />

      <Button
        variant="outlined"
        onClick={onIncrementar}
        disabled={cantidad >= stock}
      >
        +
      </Button>
    </Box>
  );
};
