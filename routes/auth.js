const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Importa la conexión a la base de datos

// Procesar el login
router.post('/IniciarSesion', (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    
    // Consulta para verificar las credenciales del usuario en la base de datos
    const query = 'SELECT * FROM usuario WHERE nombre = ? AND contraseña = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // El usuario existe, las credenciales son correctas
            req.session.username = username; // Almacena el nombre de usuario en la sesión
            req.session.avatar = results[0].avatar;
            req.session.id = results[0].id;
            console.log(req.session.id);
            res.json({ success: true });
        } else {
            // Usuario o contraseña incorrectos
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Procesar el registro
router.post('/Registro', (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const avatar = data.avatar;

    console.log(data);
    // Consulta para verificar las credenciales del usuario en la base de datos
    const query = 'INSERT INTO usuario (nombre, contraseña, avatar) VALUES (?, ?, ?)';
    db.query(query, [username, password, avatar], (err, results) => {
        if (err) {
            console.error('Error al insertar el usuario en la base de datos:', err);
            return res.status(500).send('Error al registrar el usuario.');
        }
        // El usuario existe, las credenciales son correctas
        req.session.username = username; // Almacena el nombre de usuario en la sesión
        req.session.avatar = avatar;
        res.json({ success: true, message: 'Usuario registrado con éxito.' });
    });
});

router.post('/modificarPerfil', (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const avatar = data.avatar;
    const id = req.session.id;
    console.log(data);
    console.log(id);
    // Consulta para verificar las credenciales del usuario en la base de datos
    const query = 'SELECT * FROM usuario WHERE nombre = ? AND contraseña = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // El usuario existe, las credenciales son correctas
            console.log("Usuario encontrado");
            const query2 = 'UPDATE usuario SET nombre = ? AND contraseña = ? AND avatar = ? WHERE usuario.id = ?';
            db.query(query2, [username, password, avatar, id], (err, results) => {
            if (err) {
                console.error('Error al modificar usuario en la base de datos:', err);
                return res.status(500).send('Error al modificar el usuario.');
            }
            req.session.username = username; 
            req.session.avatar = avatar;
            res.json({ success: true, message: 'Usuario modificado con éxito.' });
        });
        } else {
            res.json({ success: false, message: 'Error modificando usuario' });
        }
    
    });
});

module.exports = router;
