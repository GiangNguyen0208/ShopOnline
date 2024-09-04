const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Set up the upload directory
const uploadDir = path.join(__dirname, '../../public/images'); // Adjust the path to public/images

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

const upload = multer({ storage: storage });

const controller = require("../../controller/admin/stock.controller");

router.get("/", controller.index);
router.patch("/change-multi", controller.changeMulti);
router.patch("/postSale/:id", controller.postSale);
router.delete("/delete/:id", controller.delete);
router.get("/create", controller.create);
router.post("/create-post", upload.single('thumbnail'), controller.createPost);

module.exports = router;