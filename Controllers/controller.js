// Importamos los modelos con lo que estaremos trabajando
const ImageModel = require('../Models/imageModel');
const AudioModel = require('../Models/audioModel');
const VideoModel = require('../Models/videoModel');

const fs = require('fs');
const path = require('path');

// usaremos estos formatos para verificar que el tipo de archivo sea valido
// esto nos ayudara a verificar que solo se suban imagenes, audios y videos 
// a su carpeta correspondiente
const videoFormats = ['mp4', 'mov', 'avi', 'mpeg', '3gp'];
const audioFormats = ['mp3', 'wav', 'ogm', 'ogg', 'opus'];
const imageFormats = ['png', 'jpeg', 'jpg', 'gif', 'bmp'];


/**
 * @class la clase Controller tiene los metodos que usaremos como funciones de callback
 * 
 */
class Controller{

    /** 
    * @description devuelve todos los objetos basados en el modelo de video
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} videos || message
    */
    getVideos(req, res){
        // todas las respues son tipo JSON
        VideoModel.find().exec((err, videos) => {
            if (err) {
                res.status(500).json({message: 'Something went wrong'});
            }

            if (!videos){
                res.status(404).json({message: 'Seems the DataBase is empty'});
            }

            res.json(videos);
        })
    }

    // Guarda un nuevo video en la base de datos
    /** 
    * @description guarda  los objetos basados en el modelo de video
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} video || message
    */
    saveVideo(req, res){
        // creamos un nuevo objeto basado en nuestro modelo previamente creado
        var newVideo = new VideoModel();
        // la ruta nos ayudara a remover el video de la carpeta de videos en caso
        // de que alla ocurrido un error durante en proceso de guardado
        var path = req.files.Video.path;
        // aqui es donde se guarda toda la informacion del video subido
        var VideoData = req.files.Video;

        // rellenamos los campos del nuevo video
        newVideo.name = VideoData.name;
        newVideo.size = (VideoData.size / 1024 / 1024).toFixed(2) + ' MB';
        newVideo.type = VideoData.type.split('/')[1];
        newVideo.namestored = path.split('/')[2];
    
        // verificamos que la extension del video sea validad
        if (videoFormats.some(vf => vf === newVideo.type)){
            newVideo.save((err, video) => {
                if (err || !video){
                    // si algo salio mal removemos el video
                    fs.unlink(path, err => {
                        res.status(500).json({message: 'Something went Wrong. We could no save the video'});
                    });

                }

                // si todo salio devolvemos los datos del video que se acaba de subir
                res.json(video);
            })
        }else{ // si no lo es removemos el video 
            fs.unlink(path, err => {
                res.json({message: 'This extenstion is not valid for this file'})
            });

        }         

    }

    // Actuliza, en este caso solo el nombre, ciertos datos de un objeto en especifico
    /** 
    * @description actualiza y devuelve un objeto basado en el modelo video
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} videos || message
    */
    updateVideo(req, res){
        // recibimos el id del objeto que queremos actulizar como parametro
        var id = req.params.id;
        // recibimos el nombre nuevo por medio de un input
        var newname = req.body.name;

        // una vez tenemos los datos anteriores, procedemos a buscar y actualizar nuestro
        // objeto en la base de datos
        // para ello primero usaremos nuestro modelo en conjunto con el metodo 
        // findByIdAndUpdate que recibe los siguientes parametros
        // 1. el id del objeto a actualizar, 2. un objeto con los datos a actualizar
        // 3. una serie de opciones, en este caso {new: true} para que nos devuelva el objeto actualizado
        // 4. un funcion de call de que recibe dos parametros, el primero en caso de haber
        // algun error, y el segundo el objeto actualizado
        VideoModel.findByIdAndUpdate(id, {name: newname}, {new: true}, (err, video)=>{
            if(err){
                res.status(500).json({status: 500, message: 'Something went wrong'})
            }else if(!video){
                res.status(404).json({status: 404, message: 'The file does not exists'})
            }

            res.json(video);
        })
    }

    /** 
    * @description elimina un video de la base de datos y lo remueve de su carpeta
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} video || message
    */
    deleteVideo(req, res){
        var id = req.params.id;

        VideoModel.findByIdAndRemove(id, (err, video)=>{
            if(err){
                res.status(500).json({status: 500, message: 'Something went wrong'})
            }else if(!video){
                res.status(404).json({status: 404, message: 'The file does not exists'})
            }else{
                res.json(video);
            }

        })
    }

    /** 
    * @description devuelve todos los objetos basados en el modelo de image
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} images || message
    */
    getImages(req, res){
        ImageModel.find().exec((err, images) => {
            if (err) {
                res.status(500).json({message: 'Something went wrong'});
            }

            if (!images){
                res.status(404).json({message: 'Seems the DataBase is empty'});
            }

            res.json(images);
        })
    }

    /** 
    * @description guarda  los objetos basados en el modelo de image
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} image || message
    */
   saveImage(req, res){
        var newImage = new ImageModel();
        var path = req.files.Image.path;
        var ImageData = req.files.Image;


        newImage.name = ImageData.name;
        newImage.size = (ImageData.size / 1024 / 1024).toFixed(2) + ' MB';
        newImage.type = ImageData.type.split('/')[1];
        newImage.namestored = path.split('/')[2];
        
        if (imageFormats.some(imf => newImage.type === imf)){
            newImage.save((err, image) => {
                if (err || !image){
                    res.status(500).json({message: 'Something went Wrong. We could no save the image'});
                    
                    fs.unlink(path, err => {
                        res.json(newImage)
                    });
                }

                res.json(newImage);
            })

        }else{
            fs.unlink(path, err => {
                res.json({message: 'This extenstion is not valid for this file'})
            });

        }

    }

    /** 
    * @description actualiza y devuelve un objeto basado en el modelo image
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} image || message
    */
    updateImage(req, res){
        var id = req.params.id;
        var newname = req.body.name;

        ImageModel.findByIdAndUpdate(id, {name: newname}, {new: true}, (err, image)=>{
            if(err){
                res.status(500).json({status: 500, message: 'Something went wrong'})
            }else if(!image){
                res.status(404).json({status: 404, message: 'The file does not exists'})
            }

            res.json(image);
        })
    }

    /** 
    * @description elimina una imagen de la base de datos y lo remueve de su carpeta
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} image || message
    */
    deleteImage(req, res){
        var id = req.params.id;

        ImageModel.findByIdAndRemove(id, (err, image)=>{
            if(err){
                res.status(500).json({status: 500, message: 'Something went wrong'})
            }else if(!image){
                res.status(404).json({status: 404, message: 'The file does not exists'})
            }else{
                res.json(image);

            }

        })
    }

    /** 
    * @description devuelve todos los objetos basados en el modelo de audio
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} audios || message
    */
    getAudios(req, res){
        AudioModel.find().exec((err, musics) => {
            if (err) {
                res.status(500).json({message: 'Something went wrong'});
            }

            if (!musics){
                res.status(404).json({message: 'Seems the DataBase is empty'});
            }

            res.json(musics);
        })
    }

    /** 
    * @description guardalos objetos basados en el modelo de audio
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} audio || message
    */
    saveAudio(req, res){
        var newAudio = new AudioModel();
        var path = req.files.Audio.path;
        var AudioData = req.files.Audio;


        newAudio.name = AudioData.name;
        newAudio.size = (AudioData.size / 1024 / 1024).toFixed(2) + ' MB';
        newAudio.type = AudioData.name.split('.')[1];
        newAudio.namestored = path.split('/')[2];
        
        if (audioFormats.some(af => newAudio.type === af)){
            newAudio.save((err, audio) => {
                if (err || !audio){
                    res.status(500).json({message: 'Something went Wrong. We could no save the audio'});
                    
                    fs.unlink(path, err => {
                        res.json(newAudio)
                    });
                }

                res.json(newAudio);
            })

        }else{
            fs.unlink(path, err => {
                res.json({message: `This extenstion <<${newAudio.type}>>is not valid for this file`})
            });

        }
    }

    /** 
    * @description actualiza y devuelve un objeto basado en el modelo image
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} audios || message
    */
    updateAudio(req, res){
        var id = req.params.id;
        var newname = req.body.name;

        AudioModel.findByIdAndUpdate(id, {name: newname}, {new: true}, (err, audio)=>{
            if(err){
                res.status(500).json({status: 500, message: 'Something went wrong'})
            }else if(!audio){
                res.status(404).json({status: 404, message: 'The file does not exists'})
            }

            res.json(audio);
        })
    }

    /** 
    * @description elimina un audio de la base de datos y lo remueve de su carpeta
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {json} audio || message
    */
    deleteAudio(req, res){
        var id = req.params.id;

        AudioModel.findByIdAndRemove(id, (err, audio)=>{
            if(err){
                res.status(500).json({status: 500, message: 'Something went wrong'})
            }else if(!audio){
                res.status(404).json({status: 404, message: 'The file does not exists'})
            }else{
                res.json(audio);
            }

        })
    }

    /** 
    * @description metodo generico que devuelve el archivo correcto basandose en su extension
    * @param {objeto} req objeto proveniente del modulo express
    * @param {objeto} res objeto proveniente del modulo express
    * @return {file} file || message
    */
    getFile(req, res){
        var filename = req.params.filename;
        var videoext = filename.split('.')[1];
        var path_file = './uploads/';
        
        if(videoFormats.some( vf => vf === videoext)) path_file += `videos/${filename}`;
        if(audioFormats.some( af => af === videoext)) path_file += `audios/${filename}`;
        if(imageFormats.some( imf => imf === videoext)) path_file += `images/${filename}`;

        
        fs.exists(path_file, exists => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            }

            return res.status(404).send({
                message: "El archivo no existe"
            })
        });            

    }
}

module.exports = new Controller();