const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");
const upload = multer();

const controller = require("../../controller/admin/category.controller");
const validate = require("../../validates/admin/category.validate");

// Define routes for category management
router.get("/", controller.index); 
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.post("/create", controller.create); 
router.get("/edit/:id", controller.edit); 
router.patch("/update/:id", controller.update);
router.delete("/:id", controller.delete);
router.get('/create', controller.create);
router.post(
    "/create-post", 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.get("/detail/:id", controller.detail);

module.exports = router;
