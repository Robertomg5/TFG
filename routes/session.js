const { Router } = require("express");
const router = Router();
const db = require('../config/db');  // Importa la conexión a la base de datos

router.get('/user-data', (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (!req.session.asignatura){
        res.json({
            username: req.session.username,
            avatar: req.session.avatar
        });
    } else{
        res.json({
            username: req.session.username,
            avatar: req.session.avatar,
            asignatura: req.session.asignatura,
            asignaturaId: req.session.asignaturaId
        });
    }
});
//Añadir asignatura a la sesion
router.post('/select-asignatura', (req, res) => {
    const { asignatura } = req.body;
    
    if (!asignatura) {
        return res.status(400).json({ success: false, message: 'Asignatura no proporcionada' });
    }
    // Consulta para sacar el id de la asignatura
    const query = 'SELECT * FROM asignatura WHERE nombre = ?';
    db.query(query, [asignatura], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const idAsig = results[0].cod_asig;
            
            req.session.asignatura = asignatura; 
            req.session.asignaturaId = idAsig;
            console.log(req.session.asignaturaId);
            res.json({ success: true });
        } else {
            // Usuario o contraseña incorrectos
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});

router.post('/asignaturaInvitado', (req, res) => {
    const { asignatura } = req.body;
    const avatarInvitado = "/img/invitado.png";
    console.log(avatarInvitado);
    if (!asignatura) {
        return res.status(400).json({ success: false, message: 'Asignatura no proporcionada' });
    }
    // Consulta para sacar el id de la asignatura
    const query = 'SELECT * FROM asignatura WHERE nombre = ?';
    db.query(query, [asignatura], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const idAsig = results[0].cod_asig;
            req.session.username = "Invitado";
            req.session.avatar = avatarInvitado;
            req.session.asignatura = asignatura; 
            req.session.asignaturaId = idAsig;
            console.log(req.session.asignaturaId);
            res.json({ success: true });
        } else {
            // Usuario o contraseña incorrectos
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});


module.exports = router;