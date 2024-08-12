const { Router } = require("express");
const router = Router();
const db = require('../config/db');  // Importa la conexión a la base de datos

router.post('/examen', (req, res) => {
    const data = req.body;
    console.log(data);
    const anio = data.anio;
    const convocatoria = data.convocatoria;
    const comunidad = data.comunidad;
    const cod_asig = req.session.asignaturaId;  

    console.log(anio);
    console.log(cod_asig);
    let query = 'SELECT * FROM examen WHERE cod_asig = ?';
    const params = [cod_asig];

    if (anio) {
        query += ' AND anio = ?';
        params.push(anio);
    }
    if (convocatoria) {
        query += ' AND convocatoria = ?';
        params.push(convocatoria);
    }
    if (comunidad) {
        query += ' AND comunidad = ?';
        params.push(comunidad);
    }

    db.query(query, params, (err, results) => {
        if (err) throw err;

        // Solo devolver el nombre del archivo sin la extensión .pdf
        const examenes = results.map(examen => {
            const nombreArchivo = examen.ruta_ex.split('/').pop().replace('.pdf', '');
            return { ...examen, nombreArchivo };
        });

        res.json(examenes);
    });
});


module.exports = router;