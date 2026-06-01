const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// REGISTRO
exports.register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query =
      "INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)";
    db.query(
      query,
      [nombre, correo, hashedPassword, rol || "Cliente"],
      (error, resultados) => {
        if (error)
          return res
            .status(500)
            .json({ mensaje: "Error: Correo duplicado o falla interna" });
        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
      },
    );
  } catch (error) {
    res.status(500).json({ mensaje: "Error al procesar el registro" });
  }
};

// LOGIN
exports.login = (req, res) => {
  const { correo, password } = req.body;

  const query = "SELECT * FROM usuarios WHERE correo = ?";
  db.query(query, [correo], async (error, resultados) => {
    if (error) return res.status(500).json({ mensaje: "Error en el servidor" });
    if (resultados.length === 0)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const usuario = resultados[0];

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch)
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Si el usuario está inactivo
    if (usuario.estado === "Inactivo")
      return res
        .status(403)
        .json({ mensaje: "Usuario inactivo, contacte al admin" });

    // Generar Token
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.status(200).json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        nombre: usuario.nombre,
        rol: usuario.rol,
        correo: usuario.correo,
      },
    });
  });
};
