const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/product.controller");
const validate = require("../../validates/admin/stock.validate");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.delete);
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id", 
    validate.createPost,
    controller.editPatch
);

module.exports = router;