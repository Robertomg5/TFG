const { Router } = require("express");
const router = Router();
const db = require('../config/db');  

router.get('/user-data', (req, res) => {
    //Primer caso: entrar como invitado y elegir asignatura.
    if (!req.session.username) {
        res.json({
            avatar: req.session.avatar,
            asignatura: req.session.asignatura,
            asignaturaId: req.session.asignaturaId,
        });
    }
    //Caso para la primera pagina despues de registro o inicio de sesion.
    else if (!req.session.asignatura){
        res.json({
            username: req.session.username,
            avatar: req.session.avatar
        });
    } 
    //Caso principal: el usuario registrado elige la asignatura.
    else{
        res.json({
            username: req.session.username,
            avatar: req.session.avatar,
            asignatura: req.session.asignatura,
            asignaturaId: req.session.asignaturaId,
            id: req.session.userId
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
            //req.session.username = "Invitado";
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

//Restaurar la sesion al cerrar.
router.get('/cerrarSesion', (req, res) => {
    
    req.session.userId = null;
    req.session.username = null;
    req.session.asignatura = null;
    req.session.asignaturaId = null;
    req.session.avatar = null;
    console.log("Sesion restaurada"); 

    res.json({success: true});
});

module.exports = router;