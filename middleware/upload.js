const multer = require('multer');
const path = require('path');
const fs = require('fs');

function generateTimestamp() {
    return new Date().getTime();
}

const createStorage = (destination) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const destinationPath = path.join(__dirname, '..', destination);

            // Create the destination folder if it doesn't exist
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }

            cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
            const timestamp = generateTimestamp();
            const extension = path.extname(file.originalname);
            const fileName = `${timestamp}${extension}`;

            cb(null, fileName);
        }
    });
};

const profileImageStorage = createStorage(process.env.PROFILE_IMAGE_PATH);

const uploadProfileImage = multer({ storage: profileImageStorage }).single('profile');

module.exports = {
    uploadProfileImage
}