/** @description es la libreria que estaremos usando para manejar las peticiones HTTP*/
const express = require('express');
const app = express();
const router = require('./Routes/router');

app.set('PORT', process.env.PORT || 3000)

/**
 * @description Configuracion de cabeceras y cors
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// configuracion de express.json() que esta basado en body-parser
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(router); // le indicamos que rutar usar


module.exports = app;