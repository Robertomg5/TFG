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
            req.session.userId = results[0].id;
            console.log(req.session.userId);
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
        const query2 = 'SELECT * FROM usuario WHERE nombre = ? AND contraseña = ?';
        db.query(query2, [username, password], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                // El usuario se ha añadido a la base de datos.
                console.log("Usuario añadido");
                req.session.username = username; // Almacena el nombre de usuario en la sesión
                req.session.avatar = avatar;
                req.session.userId = results[0].id;
                res.json({ success: true, message: 'Usuario registrado con éxito.' });
            } else {
                res.json({ success: false, message: 'Error registrando al usuario' })
            }
        });
    });
});

router.post('/modificarPerfil', (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const avatar = data.avatar;
    const userId = req.session.userId;
    console.log(data);
    console.log(userId);
    // Consulta para verificar las credenciales del usuario en la base de datos
    const query = 'SELECT * FROM usuario WHERE nombre = ? AND contraseña = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0 && userId == results[0].id) {
            // El nombre de usuario es el mismo, no se ha modificado.
            const query2 = 'UPDATE usuario SET nombre = ?, contraseña = ?, avatar = ? WHERE id = ?';
            db.query(query2, [username, password, avatar, userId], (err, results) => {
            if (err) {
                console.error('Error al modificar usuario en la base de datos:', err);
                return res.status(500).send('Error al modificar el usuario.');
            }
            req.session.username = username; 
            req.session.avatar = avatar;
            res.json({ success: true, message: 'Usuario modificado con éxito.' });
            });
        }
        else if(results.length > 0){
            //El nuevo nombre ya lo está utilizando otro usuario
            console.log("Usuario con el mismo nombre");
            res.json({ success: false, message: 'Nombre de usuario en uso' });
        }
        else {
            //Nombre de usuario no repetido, se actualiza en la base de datos.
            const query3 = 'UPDATE usuario SET nombre = ?, contraseña = ?, avatar = ? WHERE id = ?';
            db.query(query3, [username, password, avatar, userId], (err, results) => {
            if (err) {
                console.error('Error al modificar usuario en la base de datos:', err);
                return res.status(500).send('Error al modificar el usuario.');
            }
            req.session.username = username; 
            req.session.avatar = avatar;
            res.json({ success: true, message: 'Usuario modificado con éxito.' });
            });
        }
    
    });
});

module.exports = router;
