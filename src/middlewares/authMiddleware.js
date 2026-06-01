const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verificarToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });

  try {
    const verified = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET,
    );
    req.usuario = verified;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: "Token no válido o expirado" });
  }
};
