const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Importa la conexión a la base de datos
const bcrypt = require('bcrypt');

// Hashing the password
const hashPassword =  async (password) => {
    try {
        const saltRounds = 10;
        const hashGenerado = await bcrypt.hash(password, saltRounds);
        console.log(hashGenerado);
        return hashGenerado;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
};

const checkPassword = async (password, hashedPassword) => {
    try {
        console.log('Contraseña almacenada en la base de datos:', hashedPassword);
        console.log('Contraseña proporcionada:', password);
        
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error checking password:', error);
        throw new Error('Error checking password: ' + error.message);
    }
};

// Procesar el login
router.post('/IniciarSesion', async (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    
    // Consulta para verificar las credenciales del usuario en la base de datos
    const query = 'SELECT * FROM usuario WHERE nombre = ?';
    db.query(query, [username], async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            // El usuario existe, comprobamos la contraseña
            const passHashed = results[0].contraseña;
            const coincide = await checkPassword(password, passHashed);
            if (coincide){
                req.session.username = username; 
                req.session.avatar = results[0].avatar;
                req.session.userId = results[0].id;
                console.log(req.session.userId);
                res.json({ success: true });
            }
            else{
                
                res.json({ success: false, message: 'Contraseña incorrecta' });
            }
        } else {
            // Usuario o contraseña incorrectos
            res.json({ success: false, message: 'Nombre de usuario incorrecto' });
        }
    });
});

// Procesar el registro
router.post('/Registro', async (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const avatar = data.avatar;
    try{
        const hashedPassword = await hashPassword(password);
        console.log(hashedPassword);
    
    const query = 'SELECT * FROM usuario WHERE nombre = ?';
        db.query(query, [username], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                // El nombre de usuario ya está en uso
                console.log("Usuario en uso");
                res.json({ success: false, message: 'El nombre de usuario está en uso' });
            } else {
                console.log("Usuario encontrado");
                const query2 = 'INSERT INTO usuario (nombre, contraseña, avatar) VALUES (?, ?, ?)';
                db.query(query2, [username, hashedPassword, avatar], (err, results) => {
                    if (err) {
                        console.error('Error al insertar el usuario en la base de datos:', err);
                        return res.status(500).send('Error al registrar el usuario.');
                    }
                    // Comprobamos que el usuario ha sido añadido
                    const query3 = 'SELECT * FROM usuario WHERE nombre = ?';
                    db.query(query3, [username], (err, results) => {
                        if (err) throw err;

                        if (results.length > 0) {
                            // El usuario se ha añadido a la base de datos.
                            req.session.username = username; 
                            req.session.avatar = avatar;
                            req.session.userId = results[0].id;
                            console.log("Usuario registrado y encontrado");
                            res.json({ success: true, message: 'Usuario registrado con éxito.' });
                        } else {
                            res.json({ success: false, message: 'Error registrando al usuario' })
                        }
                    });
                });
            }
    });
    } catch (error) {
    console.error('Error hashing the password:', error);
    res.status(500).send('Error al registrar usuario');
}
    
});

router.post('/modificarPerfil', async (req, res) => {
    const data = req.body;
    const username = data.username;
    const password = data.password;
    const avatar = data.avatar;
    const userId = req.session.userId;
    try{
        const hashedPassword = await hashPassword(password);
    
    // Consulta para verificar las credenciales del usuario en la base de datos
    const query = 'SELECT * FROM usuario WHERE nombre = ?';
    db.query(query, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0 && userId == results[0].id) {
            // El nombre de usuario es el mismo, no se ha modificado.
            const query2 = 'UPDATE usuario SET nombre = ?, contraseña = ?, avatar = ? WHERE id = ?';
            db.query(query2, [username, hashedPassword, avatar, userId], (err, results) => {
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
            db.query(query3, [username, hashedPassword, avatar, userId], (err, results) => {
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
    } catch (error) {
        console.error('Error hashing the password:', error);
        res.status(500).send('Error al registrar usuario');
    }
});

module.exports = router;
