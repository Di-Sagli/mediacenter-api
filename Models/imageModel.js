const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// este es el modelo del tipo de informacion que estaremos guardando
/**
*@description este es el modelo del tipo de informacion que estaremos guardando*/
const mongooseSchema = new Schema({
	name: String,
	size: String,
	type: String,
	namestored: String
})

// ahora asociamos nuestro esquema al modelo creado en la base de datos
// esto tambien nos permitira realizar operaciones sobre al base de datos
module.exports = mongoose.model('Image', mongooseSchema);