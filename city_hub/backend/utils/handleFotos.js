require('dotenv').config(); // Cargar las variables de entorno

const multer = require('multer');

const storage = multer.diskStorage({
    destination: __dirname + '/../res',
    filename: function(req, file, callback) { 
        const ext = file.originalname.split('.').pop(); 
        const filename = 'file-' + Date.now() + '.' + ext;
        
        // Genera la URL de la foto basada en la ruta de los archivos en el servidor
        const url = req.protocol + '://' + req.get('host') + '/' + filename;
        console.log('URL de la foto:', url);

        callback(null, filename);
    }
});

const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;
