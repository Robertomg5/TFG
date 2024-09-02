const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

//settings
app.set("port", 3000);

//middlewares
app.use(express.urlencoded({extended: false}));         //Para entender datos de formularios
app.use(express.json());                                //para recibir y entender formatos json
app.use(bodyParser.json());
app.use(session({
    secret: 'mi_secreto',           // Una cadena secreta que se utiliza para firmar la cookie de sesión
    resave: false,                  // Evita que la sesión se guarde nuevamente si no ha sido modificada
    saveUninitialized: true,        // Guarda sesiones nuevas aunque no tengan datos iniciales
    cookie: { secure: false }       // Configuración de la cookie de sesión 
}));

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para servir las páginas HTML desde la carpeta 'views'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/Registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Registro.html'));
});

app.get('/Invitado', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Invitado.html'));
});

app.get('/IniciarSesion', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'IniciarSesion.html'));
});

app.get('/asignatura', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/iniciarSesion');
    }
    res.sendFile(path.join(__dirname, 'views', 'asignatura.html'));
});

app.get('/examen', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'examen.html'));
});

app.get('/Registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Registro.html'));
});

app.get('/menuAsig', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'menuAsig.html'));
});

app.get('/ejercicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ejercicio.html'));
});

app.get('/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'perfil.html'));
});

app.get('/biblioteca', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'biblioteca.html'));
});

app.get('/visualizarTemario', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'visualizarTemario.html'));
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//routes
app.use(require("./routes/index"));
app.use(require("./routes/session"));
app.use(require("./routes/auth"));
app.use(require("./routes/examen"));
app.use(require("./routes/ejercicio"));
app.use(require("./routes/documentacion"));
app.use(require("./routes/biblioteca"));

//Start server
app.listen(app.get("port"), ()=>{
    console.log("server listening at port", 3000);
});