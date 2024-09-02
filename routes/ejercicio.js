const { Router } = require("express");
const router = Router();
const db = require('../config/db');  // Importa la conexión a la base de datos

// Obtener ejercicio aleatorio por temática
router.post('/generarEjercicio', (req, res) => {
    const { tematica } = req.body;
    const asignaturaId = req.session.asignaturaId; // ID de la asignatura almacenado en la sesión

    if (!asignaturaId || !tematica) {
        return res.status(400).json({ success: false, message: 'Faltan datos para generar el ejercicio.' });
    }

    // Consulta para obtener ejercicios de la asignatura y temática seleccionadas
    const query = 'SELECT cod_ej, ruta_ej, ruta_sol FROM ejercicio WHERE cod_asig = ? AND tematica = ?';

    db.query(query, [asignaturaId, tematica], (err, results) => {
        if (err) {
            console.error('Error al consultar los ejercicios:', err);
            return res.status(500).json({ success: false, message: 'Error al consultar los ejercicios.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No hay ejercicios disponibles para esta temática.' });
        }

        // Selecciona un ejercicio aleatorio de la lista
        const ejercicioAleatorio = results[Math.floor(Math.random() * results.length)];

        // Devuelve el ejercicio aleatorio al cliente
        res.json({ success: true, ejercicio: ejercicioAleatorio });
    });
});

// Obtener la solución del ejercicio
router.post('/verSolucion', (req, res) => {
    const { codEj } = req.body;

    if (!codEj) {
        return res.status(400).json({ success: false, message: 'No se proporcionó el código del ejercicio.' });
    }

    // Consulta para obtener la solución del ejercicio
    const query = 'SELECT ruta_sol FROM ejercicio WHERE cod_ej = ?';

    db.query(query, [codEj], (err, results) => {
        if (err) {
            console.error('Error al consultar la solución:', err);
            return res.status(500).json({ success: false, message: 'Error al consultar la solución.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró la solución para este ejercicio.' });
        }

        // Devuelve la ruta de la solución
        res.json({ success: true, solucion: results[0].ruta_sol });
    });
});


module.exports = router;