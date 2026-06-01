const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Conexión a Base de Datos
const db = require("./src/config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Para tu panel HTML

// 1. Importar TODAS las rutas (Las tuyas y las del Integrante 2)
const adminRoutes = require("./src/routes/adminRoutes");
const authRoutes = require("./src/routes/authRoutes");

// 2. Activar las rutas en el servidor
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor de RestaurantBook funcionando correctamente");
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
