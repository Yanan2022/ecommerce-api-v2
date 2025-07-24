const multer = require('multer');
const path = require('path');
const { unlink } = require('fs/promises');

const ALLOWED_EXTENSIONS = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (_, file, cb) => {
        const filename = file.originalname
                        .replace('  ', '-')
                        .replace('.png', '')
                        .replace('.jpg', '')
                        .replace('.jpeg', '');

        const extension = ALLOWED_EXTENSIONS[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);

        // cb(`null, ${filename}-${Date.now()}.${extension}`)
    }
});

exports.upload = multer({ 
    storage: storage, 
    // 5mb
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (_, file, cb) => {
        const isValid = ALLOWED_EXTENSIONS[file.mimetype];
        let uploadError = new Error(`Invalid image type\n: ${file.mimetype} is not allowed`);
        if (!isValid) return cb(uploadError);
        return cb(null, true);
    }
    
});

exports.deleteImages = async  (imageUrls, continueOnErrorName) => {
    await Promise.all(imageUrls.map(async (imageUrl) =>{
        const imagePath = path.resolve(
            __dirname,
            '..',
            'public',
            'uploads',
            path.basename(imageUrl),
            imageUrl
        );

        try {
            await unlink(imagePath);
        } catch (error) {
           
            if (error.code === continueOnErrorName) { 
                console.error(`Continuing with the the next image: ${error.message}`);
            }else {
                console.error(`Error deleting image: ${error.message}`);
                throw error;  // rethrow the error for the caller to handle
            }
        }

        console.log(`Deleted image: ${imageUrl} `);

    }));
};