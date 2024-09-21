"use strict";

// MODEL
var Product = require("../../models/product.model"); // HELPER


var formatVNDHelper = require("../../helper/formatVND"); // [GET] /products


module.exports.index = function _callee(req, res) {
  var products, numberFormat, newProduct;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Product.find({
            status: "active",
            deleted: false
          }).sort({
            position: "desc"
          }));

        case 2:
          products = _context.sent;
          // Format VND
          numberFormat = formatVNDHelper.numberFormatter();
          newProduct = products.map(function (item) {
            var priceNew = item.price * (100 - item.discountPercentage) / 100 * 23000;
            item.priceNew = numberFormat.format(priceNew);
            var priceFormat = item.price * 23000;
            item.priceFormat = numberFormat.format(priceFormat);
            return item;
          });
          res.render("client/pages/products/index", {
            pageTitle: "Trang danh sách sản phẩm",
            products: newProduct
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}; // [GET] /products/:slug


module.exports.detail = function _callee2(req, res) {
  var find, product;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
          };
          _context2.next = 4;
          return regeneratorRuntime.awrap(Product.findOne(find));

        case 4:
          product = _context2.sent;

          if (product) {
            _context2.next = 8;
            break;
          }

          req.flash("error", "Product not found!");
          return _context2.abrupt("return", res.redirect("back"));

        case 8:
          res.render("client/pages/products/detail-product", {
            pageTitle: "Detail Products",
            product: product
          });
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          req.flash("error", "Product not found!");
          res.redirect("/products");

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};