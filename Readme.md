# 🛒 E-Commerce Full Stack App

Este es un proyecto de e-commerce desarrollado con una arquitectura **Full Stack**, como parte de mi formación en desarrollo web y para mostrar en mi portfolio profesional.

> 🔧 Proyecto en desarrollo - Próximamente será dockerizado y desplegado en la nube.

---

## 🚀 Tecnologías Utilizadas

### 🔹 Backend (.NET Core Web API)
- ASP.NET Core 8
- ASP.NET Identity
- Autenticación y autorización con JWT
- Entity Framework Core
- PostgreSQL como base de datos

### 🔹 Frontend (React)
- React 18
- Material UI
- React Router DOM
- Axios para consumo de APIs
- Context API para manejo de estado global (autenticación, carrito, etc.)

---

## 👥 Roles y Funcionalidades

### 🔐 **Autenticación y Autorización**
- Registro y login con roles: Administrador, Vendedor y Comprador.
- Protección de rutas según permisos con JWT.

### 👤 **Administrador**
- Ver todos los productos (activos e inactivos).
- Acceder al historial de compras de todos los compradores.

### 🛍️ **Vendedor**
- Publicar productos con imágenes, nombre, precio y descripción.
- Ver ventas realizadas.

### 🛒 **Comprador**
- Ver productos disponibles.
- Agregar productos al carrito.
- Confirmar compras y consultar su historial.

---

## 🧱 Base de Datos

La base de datos fue modelada en PostgreSQL con las siguientes entidades principales:

- `Usuarios` (Identity)
- `Productos`
- `Carritos`
- `Compras`
- `Detalles de compra`
- `Roles` (Administrador, Vendedor, Comprador)

Se utilizó **Entity Framework Core** para realizar las migraciones y mantener el esquema actualizado.

---

## 🗂️ Organización del Código

- `ClientApp/` → Código del frontend en React.
- `Api/` → Código del backend ASP.NET Core.
- `Data/` → Contexto de base de datos y entidades.
- `Controllers/` → Controladores de la API REST.
- `Services/` → Lógica de negocio.
- `DTOs/` → Objetos de transferencia de datos.

---

## 🔜 Próximos Pasos

- [ ] Dockerizar el frontend y backend
- [ ] Configurar `docker-compose` para levantar toda la solución
- [ ] Deploy en Railway o Azure
- [ ] Agregar tests unitarios y de integración
- [ ] Publicar demo online

---

## 📸 Capturas

> *(Agregá aquí imágenes de las interfaces principales del sistema: login, dashboard del vendedor, listado de productos, carrito de compras, etc.)*

---

## 🧠 Lo que aprendí

- Configurar autenticación y autorización con **JWT + ASP.NET Identity**
- Separar responsabilidades entre frontend y backend
- Uso de **React con Material UI** para construir interfaces modernas
- Consumir APIs RESTful y manejar sesiones en React
- Modelar relaciones complejas en una base de datos relacional (**PostgreSQL**)
- Aplicar buenas prácticas en el diseño de APIs

---

## 📚 Contexto académico

Este proyecto nace como una evolución de una práctica académica en la materia **Programación 3**, donde originalmente trabajamos con ASP.NET MVC. Decidí llevar el proyecto a un nivel más avanzado y aplicar tecnologías modernas como **React + Web API**.

---

## 🤝 Contribuciones

Este proyecto es personal, pero estoy abierto a sugerencias o ideas para mejorarlo.  
¡Todo feedback es bienvenido!

