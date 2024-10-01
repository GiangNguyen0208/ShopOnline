const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");
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
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
module.exports = router;