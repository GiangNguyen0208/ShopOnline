"use strict";

var express = require("express");

var router = express.Router();

var multer = require('multer');

var cloudinary = require("cloudinary").v2;

var streamifier = require("streamifier");

var path = require('path');

var fs = require('fs'); // const storageMulterHelper = require("../../helper/storageMulter");
// Set up Cloudinary


cloudinary.config({
  cloud_name: 'dnfakbsmn',
  api_key: '137735426286615',
  api_secret: 'Y_-ANlwtKfN9EC7Rk_jTFR-bsCE' // Click 'View API Keys' above to copy your API secret

}); // End Cloudinary

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
router.post("/create-post", upload.single('thumbnail'), function (req, res, next) {
  if (req.file) {
    var _upload = function _upload(req) {
      var result;
      return regeneratorRuntime.async(function _upload$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(streamUpload(req));

            case 2:
              result = _context.sent;
              console.log(result.secure_url);
              req.body[req.file.fieldname] = result.secure_url;
              next();

            case 6:
            case "end":
              return _context.stop();
          }
        }
      });
    };

    var streamUpload = function streamUpload(req) {
      return new Promise(function (resolve, reject) {
        var stream = cloudinary.uploader.upload_stream(function (error, result) {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    _upload(req);
  } else {
    next();
  }
}, validate.createPost, controller.createPost);
module.exports = router;