const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/db");

const adminRoutes = require("./src/routes/adminRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const reservationRoutes = require("./src/routes/reservationRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/admin", adminRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api", reservationRoutes);

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
