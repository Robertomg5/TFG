const { Router } = require("express");
const router = Router();
const db = require('../config/db');  

//Mostrar los documentos de la tematica elegida
router.get('/getDocumentacion', (req, res) => {
    const tematica = req.query.tematica;
    const asig = req.session.asignaturaId;

    const query = `SELECT * FROM documentacion WHERE tematica = ? AND cod_asig = ?`;
    
    db.query(query, [tematica, asig], (err, results) => {
        if (err) throw err;
        const docs = results.map(documento => {
            const nombreArchivo = documento.ruta_doc.split('/').pop().replace('.pdf', '');
            return { ...documento, nombreArchivo };
        });

        res.json(docs);
    });
});

module.exports = router;