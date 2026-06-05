const db = require("../config/db");

exports.crearReserva = (req, res) => {

    console.log(req.body);

    const {
        id_usuario,
        nombre_cargo,
        contacto,
        fecha,
        hora_preferida,
        numero_personas,
        solicitudes_especiales
    } = req.body;

    const verificarDisponibilidad = `
        SELECT COUNT(*) AS total
        FROM reservas
        WHERE fecha = ?
        AND hora_preferida = ?
        AND estado <> 'Cancelada'
    `;

    db.query(
        verificarDisponibilidad,
        [fecha, hora_preferida],
        (error, resultados) => {

            if(error){

                console.error(error);

                return res.status(500).json({
                    mensaje: "Error al verificar disponibilidad"
                });

            }

            const totalReservas =
            resultados[0].total;

            if(totalReservas >= 12){

                return res.status(400).json({
                    mensaje:
                    "No hay mesas disponibles para este horario"
                });

            }

            const query = `
                INSERT INTO reservas
                (
                    id_usuario,
                    nombre_cargo,
                    contacto,
                    fecha,
                    hora_preferida,
                    numero_personas,
                    solicitudes_especiales
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                query,
                [
                    id_usuario,
                    nombre_cargo,
                    contacto,
                    fecha,
                    hora_preferida,
                    numero_personas,
                    solicitudes_especiales
                ],
                (error, resultados) => {

                    if(error){

                        console.error(error);

                        return res.status(500).json({
                            mensaje:
                            "Error al crear reserva"
                        });

                    }

                    res.status(201).json({
                        mensaje:
                        "Reserva creada correctamente",
                        id: resultados.insertId
                    });

                }
            );

        }
    );

};

exports.obtenerReservas = (req, res) => {

    const query = `
        SELECT *
        FROM reservas
        ORDER BY fecha ASC, hora_preferida ASC
    `;

    db.query(query, (error, resultados) => {

        if(error){

            console.error(error);

            return res.status(500).json({
                mensaje: "Error al obtener reservas"
            });

        }

        res.status(200).json(resultados);

    });

};

exports.cancelarReserva = (req, res) => {

    const id = req.params.id;

    const query = `
        UPDATE reservas
        SET estado = 'Cancelada'
        WHERE id_reserva = ?
    `;

    db.query(query, [id], (error) => {

        if(error){
            return res.status(500).json({
                mensaje: "Error al cancelar reserva"
            });
        }

        res.json({
            mensaje: "Reserva cancelada correctamente"
        });

    });

};

exports.actualizarReserva = (req, res) => {

    const { id } = req.params;

    const {
        fecha,
        hora_preferida,
        numero_personas
    } = req.body;

    const query = `
        UPDATE reservas
        SET
            fecha = ?,
            hora_preferida = ?,
            numero_personas = ?
        WHERE id_reserva = ?
    `;

    db.query(
        query,
        [
            fecha,
            hora_preferida,
            numero_personas,
            id
        ],
        (error, resultados) => {

            if(error){

                console.error(error);

                return res.status(500).json({
                    mensaje: "Error al actualizar reserva"
                });

            }

            res.status(200).json({
                mensaje: "Reserva actualizada"
            });

        }
    );

};

exports.obtenerReservasPorCorreo = (req, res) => {

    const { correo } = req.params;

    const query = `
        SELECT *
        FROM reservas
        WHERE contacto LIKE ?
        ORDER BY fecha ASC,
                 hora_preferida ASC
    `;

    db.query(
        query,
        [`%${correo}%`],
        (error, resultados) => {

            if(error){

                console.error(error);

                return res.status(500).json({
                    mensaje:
                    "Error al obtener reservas"
                });

            }

            res.status(200).json(resultados);

        }
    );

};