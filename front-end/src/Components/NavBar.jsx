import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  InputBase,
  Badge,
  Tooltip,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  alpha,
  styled,
} from "@mui/material";
import {
  ShoppingCart,
  Search,
  Menu as MenuIcon,
  AccountCircle,
  Close,
} from "@mui/icons-material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useSearch } from "../context/SearchProvider";
import { useCarrito } from "../context/CarritoProvider";
import { useState, useCallback } from "react";

// Estilos reutilizables
const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 400,
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  transition: theme.transitions.create("width"),
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
    width: "100%",
  },
}));

const ClearButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 40,
  color: theme.palette.common.white,
  opacity: 0.7,
  "&:hover": {
    opacity: 1,
    backgroundColor: "transparent",
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: "inherit",
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
}));

export const NavBar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [busqueda, setBusqueda] = useState("");
  const { setTerminoBusqueda, limpiarBusqueda } = useSearch();
  const { carrito } = useCarrito();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  // Manejar búsqueda
  const handleBuscar = useCallback(() => {
    const valorBusqueda = busqueda.trim();
    if (valorBusqueda === "") {
      limpiarBusqueda();
    } else {
      setTerminoBusqueda(valorBusqueda);
    }

    // Solo redirigir si no estamos en el home
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, [
    busqueda,
    navigate,
    location.pathname,
    setTerminoBusqueda,
    limpiarBusqueda,
  ]);

  // Cerrar sesión
  const handleCerrarSesion = useCallback(() => {
    logout();
    limpiarBusqueda();
    sessionStorage.removeItem("datosProducto");
    navigate("/");
    setAnchorEl(null);
  }, [logout, limpiarBusqueda, navigate]);

  // Menú
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  // Manejar Enter en el input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBuscar();
    }
  };

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={4}
      sx={{
        background: `linear-gradient(135deg, ${
          theme.palette.primary.main
        } 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        {/* Logo y búsqueda */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: isMobile ? 1 : 0,
            gap: 2,
          }}
        >
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menú"
              onClick={handleOpenMenu}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            color="inherit"
            sx={{
              textDecoration: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": { opacity: 0.9 },
            }}
          >
            <span role="img" aria-label="logo">
              🛍️
            </span>
            <Box
              component="span"
              sx={{ display: { xs: "none", sm: "inline" } }}
            >
              Tienda Online
            </Box>
          </Typography>

          {/* Búsqueda solo en home y no móvil */}
          {location.pathname === "/" && !isMobile && (
            <SearchBox component="form" onSubmit={(e) => e.preventDefault()}>
              <IconButton
                type="button"
                sx={{ p: "10px", color: "inherit" }}
                onClick={handleBuscar}
                aria-label="buscar"
              >
                <Search />
              </IconButton>
              <SearchInput
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                onKeyDown={handleKeyDown}
                inputProps={{ "aria-label": "buscar productos" }}
              />
              {busqueda && (
                <ClearButton
                  onClick={() => {
                    setBusqueda("");
                    limpiarBusqueda();
                  }}
                  aria-label="limpiar búsqueda"
                >
                  <Close fontSize="small" />
                </ClearButton>
              )}
            </SearchBox>
          )}
        </Box>

        {/* Menú desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!usuario && (
              <>
                <StyledButton component={NavLink} to="/login">
                  Iniciar Sesión
                </StyledButton>
                <StyledButton
                  component={NavLink}
                  to="/registro"
                  variant="outlined"
                >
                  Registrarse
                </StyledButton>
              </>
            )}

            {usuario?.rol === "Vendedor" && (
              <>
                <StyledButton component={NavLink} to="/crearProducto">
                  Cargar Producto
                </StyledButton>
                <StyledButton component={NavLink} to="/ventasVendedor">
                  Mis Ventas
                </StyledButton>
              </>
            )}

            {usuario?.rol === "Admin" && (
              <StyledButton component={NavLink} to="/todasVentasAdmin">
                Todas las Ventas
              </StyledButton>
            )}

            {usuario?.rol === "Comprador" && (
              <>
                <Tooltip title="Carrito de compras" arrow>
                  <IconButton
                    component={NavLink}
                    to="/carrito"
                    color="inherit"
                    size="large"
                    sx={{ p: 1.5 }}
                  >
                    <Badge badgeContent={carrito.length} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <StyledButton component={NavLink} to="/comprasComprador">
                  Mis Compras
                </StyledButton>
              </>
            )}

            {usuario && (
              <Tooltip title="Tu cuenta" arrow>
                <IconButton
                  onClick={handleOpenMenu}
                  size="small"
                  sx={{ ml: 1 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: theme.palette.secondary.main,
                    }}
                  >
                    <AccountCircle />
                  </Avatar>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}

        {/* Icono de carrito en móvil */}
        {isMobile && usuario && (
          <Tooltip title="Carrito" arrow>
            <IconButton
              component={NavLink}
              to="/carrito"
              color="inherit"
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={carrito.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Tooltip>
        )}

        {/* Menú desplegable (móvil o perfil) */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleCloseMenu}
          onClick={handleCloseMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* Búsqueda en móvil */}
          {isMobile && location.pathname === "/" && (
            <MenuItem sx={{ px: 2, py: 1 }}>
              <SearchBox fullWidth>
                <SearchInput
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <IconButton onClick={handleBuscar} sx={{ color: "inherit" }}>
                  <Search />
                </IconButton>
                {busqueda && (
                  <ClearButton
                    onClick={() => {
                      setBusqueda("");
                      limpiarBusqueda();
                    }}
                    sx={{ right: 50 }}
                  >
                    <Close fontSize="small" />
                  </ClearButton>
                )}
              </SearchBox>
            </MenuItem>
          )}

          {/* Opciones según rol (móvil) */}
          {isMobile && !usuario && (
            <>
              <MenuItem component={NavLink} to="/login">
                Iniciar Sesión
              </MenuItem>
              <MenuItem component={NavLink} to="/registro">
                Registrarse
              </MenuItem>
            </>
          )}

          {isMobile && usuario?.rol === "Vendedor" && (
            <>
              <MenuItem component={NavLink} to="/crearProducto">
                Crear Producto
              </MenuItem>
              <MenuItem component={NavLink} to="/ventasVendedor">
                Mis Ventas
              </MenuItem>
            </>
          )}

          {isMobile && usuario?.rol === "Admin" && (
            <MenuItem component={NavLink} to="/todasVentasAdmin">
              Todas las Ventas
            </MenuItem>
          )}

          {isMobile && usuario?.rol === "Comprador" && (
            <MenuItem component={NavLink} to="/comprasComprador">
              Mis Compras
            </MenuItem>
          )}

          {/* Información de usuario y cierre */}
          {usuario && (
            <>
              <MenuItem disabled>
                <Typography variant="body2" color="textPrimary">
                  Hola, <strong>{usuario.username}</strong>
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem disabled>
                <Typography variant="body2" color="textPrimary">
                  Rol: <strong>{usuario.rol}</strong>
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleCerrarSesion}
                sx={{ color: "error.main" }}
              >
                Cerrar Sesión
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
