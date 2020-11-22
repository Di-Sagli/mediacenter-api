const express = require('express')
const Controller = require('../Controllers/controller');
const router = express.Router();
const multipart = require('connect-multiparty');

/** @description middleware para guardar los archivos en la respectiva carpeta*/
const videoupload = multipart({uploadDir: './uploads/videos'});
const audiosupload = multipart({uploadDir: './uploads/audios'});
const imagesupload = multipart({uploadDir: './uploads/images'});

router.get('/', (req, res)=>{
    res.json({getMethods: [
    	'getvideos', 'getimages', 'getaudios', 'getfile/:filename'
    	]});
})


router.get('/getvideos', Controller.getVideos);
router.get('/getimages', Controller.getImages);
router.get('/getaudios', Controller.getAudios);
router.get('/getfile/:filename', Controller.getFile);

/** los middleware 'videoupload', 'imagesupload' y 'audiosupload'
* guardar el archivo subido automaticamente a la carpeta correspondiente
*/
router.post('/uploadvideo', videoupload, Controller.saveVideo);
router.post('/uploadimage', imagesupload, Controller.saveImage);
router.post('/uploadaudio', audiosupload, Controller.saveAudio);

router.delete('/deletevideo/:id', Controller.deleteVideo);
router.delete('/deleteaudio/:id', Controller.deleteAudio);
router.delete('/deleteimage/:id', Controller.deleteImage);

router.put('/updatevideo/:id', Controller.updateVideo);
router.put('/updateaudio/:id', Controller.updateAudio);
router.put('/updateimage/:id', Controller.updateImage);

module.exports = router;