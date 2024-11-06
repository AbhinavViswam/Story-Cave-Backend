const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Define the destination folder where the images will be stored
        cb(null, path.join(__dirname, '../public/productImages')); 
    },
    filename: function(req, file, cb) {
        // Create a unique suffix to prevent file name conflicts
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        
        // Use the original file name and append the unique suffix to it
        cb(null, file.originalname.split('.')[0] + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = upload;
