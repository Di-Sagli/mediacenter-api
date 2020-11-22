const app = require('./app');
/** 
* @description librerias requeridas para conectarnos a la base de datos*/
const mongoose = require('mongoose');


/** configuracion necesaria para eliminar los warnings de mongoose */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


console.log('trying to connect with the DB.')
mongoose.connect('mongodb://localhost:27017/MediaCenter')
.then(()=>{
    console.log('Conection with the DB sucessfull')
        app.listen(app.get('PORT'), ()=>{
            console.log('running on port '+app.get('PORT'));
        })
    })
.catch(e => {
	console.log("We could not laid a connection")
	console.error(e)});