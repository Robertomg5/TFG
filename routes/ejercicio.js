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

// Añadir ejercicio a la biblioteca
router.post('/addEjercicioABiblioteca', (req, res) => {
    const ejercicioId = req.body.ejercicioId;
    const usuarioId = req.session.userId; 

    if (!ejercicioId || !usuarioId) {
        return res.status(400).json({ success: false, message: 'Faltan datos para añadir a la biblioteca.' });
    }

    // Inserción en la tabla biblioteca
    const query = 'INSERT INTO biblioteca (ejercicio_id, usuario_id) VALUES (?, ?)';

    db.query(query, [ejercicioId, usuarioId], (err, results) => {
        if (err) {
            console.error('Error al añadir a la biblioteca:', err);
            return res.status(500).json({ success: false, message: 'Error al añadir a la biblioteca.' });
        }

        res.json({ success: true, message: 'Ejercicio añadido a la biblioteca con éxito.' });
    });
});

// Obtener los ejercicios de la biblioteca de un usuario.
router.get('/getEjerciciosBiblioteca', (req, res) => {
    const userId = req.session.userId;  
    const asig = req.query.asignatura;
    let cod_asig = 2;
    console.log(userId);
    
    if(asig == "Matematicas"){
        cod_asig = 1;
    }
    console.log(cod_asig);
    const query = `
        SELECT e.cod_ej, e.ruta_ej, e.ruta_sol 
        FROM biblioteca b
        JOIN ejercicio e ON b.ejercicio_id = e.cod_ej
        WHERE b.usuario_id = ? AND e.cod_asig = ?;
    `;
    
    db.query(query, [userId, cod_asig], (err, results) => {
        if (err) throw err;
        console.log(results[0].ruta_ej);
        res.json(results);
    });
});

// Elimina un ejercicio de la biblioteca
router.post('/deleteEjercicioBiblioteca', (req, res) => {
    const cod_ej = req.body.ejercicioId;
    const userId = req.session.userId;
    console.log(cod_ej);

    const query = `DELETE FROM biblioteca WHERE ejercicio_Id = ? AND usuario_Id = ?`;
    
    db.query(query, [cod_ej, userId], (err, results) => {
        if (err) {
            console.error('Error al eliminar el ejercicio de la biblioteca:', err);
            return res.status(500).json({ success: false, message: 'Error al eliminar.' });
        }

        res.json({ success: true, message: 'Ejercicio eliminado de la biblioteca con éxito.' });
    });
});



module.exports = router;