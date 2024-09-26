const express = require("express");
const router = express.Router();
const multer = require('multer');
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const path = require('path');
const fs = require('fs');

// const storageMulterHelper = require("../../helper/storageMulter");

// Set up Cloudinary
cloudinary.config({ 
    cloud_name: 'dnfakbsmn', 
    api_key: '137735426286615', 
    api_secret: 'Y_-ANlwtKfN9EC7Rk_jTFR-bsCE' // Click 'View API Keys' above to copy your API secret
});
// End Cloudinary
const upload = multer();

const controller = require("../../controller/admin/stock.controller");
const validate = require("../../validates/admin/stock.validate");
const { log } = require("console");

router.get("/", controller.index);
router.patch("/change-multi", controller.changeMulti);
router.patch("/postSale/:id", controller.postSale);
router.delete("/delete/:id", controller.delete);
router.get("/create", controller.create);
router.post(
    "/create-post", 
    upload.single('thumbnail'),
    function (req, res, next) {
        if (req.file) {
            let streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    let stream = cloudinary.uploader.upload_stream(
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
    
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };
    
            async function upload(req) {
                let result = await streamUpload(req);
                console.log(result.secure_url);
                req.body[req.file.fieldname] = result.secure_url;
                next();
            }
            upload(req);
        } else {
            next();
        }
    },
    validate.createPost,
    controller.createPost
);
module.exports = router;