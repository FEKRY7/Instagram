const multer = require('multer');

const HME = (err, req, res, next) => {
    if (err && err.message === 'Invalid format') {
        res.status(400).json({ message: 'Invalid image file', error: err.message });
    } else {
        next(err); // Pass the error to the default error handler
    }
};

const myMulter = () => {
 
    const fileValidation = {
        image: ['image/png', 'image/jpeg', 'image/gif'],
        video: ['video/mp4', 'video/quicktime'],
    }

    // Configure multer disk storage
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        const allowedTypes = [...fileValidation.image, ...fileValidation.video]; // Combine all allowed types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid format'), false);
        }
    } 

    const upload = multer({ storage, fileFilter });
    return upload;
}

module.exports = {
    HME,
    myMulter
};
