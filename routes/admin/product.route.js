const express = require("express");
const multer = require('multer');
const router = express.Router();

const controller = require("../../controller/admin/product.controller");
const validate = require("../../validates/admin/stock.validate");

const upload = multer(); // Đường dẫn lưu trữ tệp

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.delete);
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id", 
    upload.single('thumbnail'),
     
    validate.createPost, 
    controller.editPatch
);
router.get("/detail/:id", controller.detail);

module.exports = router;