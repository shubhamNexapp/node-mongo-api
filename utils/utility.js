const moment = require('moment')
const fs = require('fs');
const path = require("path");
const multer = require("multer");
const UserImagePath = process.env.PROFILE_IMAGE_PATH



// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Specify upload directory
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique filename
    },
});

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images only!"); // Only allow images
        }
    },
});

module.exports = { upload }