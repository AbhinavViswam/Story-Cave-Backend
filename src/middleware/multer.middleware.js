const multer = require('multer');
const path = require('path');

console.log(path.join(__dirname, '../public/productImages'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        
        cb(null, path.join(__dirname, '../public/productImages')); 
    },
    filename: function(req, file, cb) {
     
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        
        
        cb(null, file.originalname.split('.')[0] + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = upload;
