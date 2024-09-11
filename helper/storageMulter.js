const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up the upload directory
const uploadDir = path.join(__dirname, '../public/uploads/'); // Adjust the path to public/images

// Check if the upload directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory recursively
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Rename the file
  }
});


module.exports = storage;