"use strict";

var express = require("express");

var router = express.Router();

var multer = require('multer');

var path = require('path');

var fs = require('fs');

var uploadCloud = require("../../middleware/admin/uploadCloud.middleware");

var upload = multer();

var controller = require("../../controller/admin/stock.controller");

var validate = require("../../validates/admin/stock.validate");

var _require = require("console"),
    log = _require.log;

router.get("/", controller.index);
router.patch("/change-multi", controller.changeMulti);
router.patch("/postSale/:id", controller.postSale);
router["delete"]("/delete/:id", controller["delete"]);
router.get("/create", controller.create);
router.post("/create-post", upload.single('thumbnail'), uploadCloud.upload, validate.createPost, controller.createPost);
module.exports = router;