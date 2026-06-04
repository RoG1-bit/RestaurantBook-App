const express = require("express");

const router = express.Router();

const reservationController =
require("../controllers/reservationController");

router.put(
    "/reservas/:id/cancelar",
    reservationController.cancelarReserva
);
router.post(
    "/reservas",
    reservationController.crearReserva
);

router.put(
    "/reservas/:id",
    reservationController.actualizarReserva
);

router.get(
    "/reservas",
    reservationController.obtenerReservas
);

module.exports = router;