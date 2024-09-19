"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// MODEL
var Product = require("../../models/product.model"); // CONFIG


var config = require("../../config/system"); // HELPER


var filterStatusHelper = require("../../helper/filterStatus");

var filterKeywordHelper = require("../../helper/filterKeyword");

var formatVNDHelper = require("../../helper/formatVND");

var paginationHelper = require("../../helper/pagination"); // [GET] /admin/products


module.exports.index = function _callee(req, res) {
  var path, listActive, numberFormat, filterStatus, find, filterKeyword, countProduct, productPagination, products, newProduct;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Define path
          path = config.prefixAdmin + "/products"; // Define listActive

          listActive = ["active", "inactive", "delete-all", "change-position"]; // Format VND

          numberFormat = formatVNDHelper.numberFormatter(); // Filter Status

          filterStatus = filterStatusHelper(req.query); // Filter Condition

          find = {
            deleted: false
          };

          if (req.query.status) {
            find.status = req.query.status;
          } // END FILTER STATUS
          // Filter KEYWORD


          filterKeyword = filterKeywordHelper(req.query, find); // END Filter KEYWORK
          // Product Count

          _context.next = 9;
          return regeneratorRuntime.awrap(Product.countDocuments(find));

        case 9:
          countProduct = _context.sent;
          // Pagination 
          productPagination = paginationHelper({
            currentPage: 1,
            limitItem: 5
          }, req.query, countProduct); // END Pagination
          // Return Product

          _context.next = 13;
          return regeneratorRuntime.awrap(Product.find(find).sort({
            position: "desc"
          }).limit(productPagination.limitItem).skip(productPagination.skip));

        case 13:
          products = _context.sent;
          // Format price to VND
          newProduct = products.map(function (item) {
            var priceNew = item.price * (100 - item.discountPercentage) / 100 * 23000;
            item.priceNew = numberFormat.format(priceNew);
            var priceFormat = item.price * 23000;
            item.priceFormat = numberFormat.format(priceFormat);
            return item;
          });
          res.render("admin/pages/products/index", {
            pageTitle: "Trang quản lý sản phẩm",
            products: products,
            filterStatus: filterStatus,
            filterKeyword: filterKeyword,
            pagination: productPagination,
            listActive: listActive,
            path: path,
            messages: req.flash()
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  });
}; // [PATCH] /admin/products/change-status/:status/:id


module.exports.changeStatus = function _callee2(req, res) {
  var status, id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          status = req.params.status;
          id = req.params.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            status: status
          }));

        case 4:
          req.flash("success", "Update item status successfully !!!");
          res.redirect("back");

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // [PATCH] /admin/products/change-multi


module.exports.changeMulti = function _callee3(req, res) {
  var type, ids, updateStatus, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _item$split, _item$split2, id, position;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          type = req.body.type;
          ids = req.body.ids.split(", ");
          _context3.t0 = type;
          _context3.next = _context3.t0 === "active" ? 5 : _context3.t0 === "inactive" ? 8 : _context3.t0 === "delete-all" ? 10 : _context3.t0 === "change-position" ? 14 : 44;
          break;

        case 5:
          updateStatus = "active";
          req.flash("success", "Update status successfully ".concat(ids.length, " item !!!"));
          return _context3.abrupt("break", 45);

        case 8:
          updateStatus = "inactive";
          req.flash("success", "Update status successfully ".concat(ids.length, " item !!!"));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: ids
            }
          }, {
            deleted: true,
            deletedAt: new Date()
          }));

        case 12:
          req.flash("success", "Deleted successfully ".concat(ids.length, " item !!!"));
          return _context3.abrupt("break", 45);

        case 14:
          // const positions = new Set();
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 17;
          _iterator = ids[Symbol.iterator]();

        case 19:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 28;
            break;
          }

          item = _step.value;
          _item$split = item.split("-"), _item$split2 = _slicedToArray(_item$split, 2), id = _item$split2[0], position = _item$split2[1];
          console.log("ID: ".concat(id, ", Position: ").concat(position)); // Debugging line

          _context3.next = 25;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            position: parseInt(position, 10)
          }));

        case 25:
          _iteratorNormalCompletion = true;
          _context3.next = 19;
          break;

        case 28:
          _context3.next = 34;
          break;

        case 30:
          _context3.prev = 30;
          _context3.t1 = _context3["catch"](17);
          _didIteratorError = true;
          _iteratorError = _context3.t1;

        case 34:
          _context3.prev = 34;
          _context3.prev = 35;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 37:
          _context3.prev = 37;

          if (!_didIteratorError) {
            _context3.next = 40;
            break;
          }

          throw _iteratorError;

        case 40:
          return _context3.finish(37);

        case 41:
          return _context3.finish(34);

        case 42:
          req.flash("success", "Change position successfully ".concat(ids.length, " item !!!"));
          return _context3.abrupt("break", 45);

        case 44:
          return _context3.abrupt("break", 45);

        case 45:
          if (!(type !== "delete-all" && type !== "change-position")) {
            _context3.next = 48;
            break;
          }

          _context3.next = 48;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: ids
            }
          }, {
            status: updateStatus
          }));

        case 48:
          res.redirect("back");

        case 49:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[17, 30, 34, 42], [35,, 37, 41]]);
}; // [DELETE] /admin/products/:id


module.exports["delete"] = function _callee4(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          req.flash("success", "Deleted successfully a item !!!"); // Delete item on view

          _context4.next = 4;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            deleted: true,
            deletedAt: new Date()
          }));

        case 4:
          res.redirect("back");

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // [GET] /admin/products/edit/:id 


module.exports.edit = function _callee5(req, res) {
  var find, product;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          find = {
            deleted: false,
            _id: req.params.id
          };
          _context5.next = 4;
          return regeneratorRuntime.awrap(Product.findOne(find));

        case 4:
          product = _context5.sent;

          if (product) {
            _context5.next = 8;
            break;
          }

          req.flash("error", "Product not found!");
          return _context5.abrupt("return", res.redirect("back"));

        case 8:
          res.render("admin/pages/products/edit", {
            pageTitle: "Edit Products",
            product: product
          });
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          req.flash("error", "Product not found!");
          res.redirect("".concat(config.prefixAdmin, "/products"));

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // [PATCH] /admin/products/edit/:id


module.exports.editPatch = function _callee6(req, res) {
  var id, countProducts;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          console.log(req.body);
          id = req.params.id;

          if (req.file && req.file.filename) {
            req.body.thumbnail = "/uploads/".concat(req.file.filename);
          }

          req.body.price = parseInt(req.body.price);
          req.body.discountPercentage = parseInt(req.body.discountPercentage);
          req.body.stock = parseInt(req.body.stock);

          if (!req.body.position) {
            _context6.next = 11;
            break;
          }

          req.body.position = parseInt(req.body.position);
          _context6.next = 15;
          break;

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(Product.countDocuments({}));

        case 13:
          countProducts = _context6.sent;
          req.body.position = countProducts + 1;

        case 15:
          _context6.next = 17;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id,
            deleted: false
          }, req.body));

        case 17:
          req.flash("success", "Cập nhật sản phẩm thành công!");
          _context6.next = 23;
          break;

        case 20:
          _context6.prev = 20;
          _context6.t0 = _context6["catch"](0);
          req.flash("error", "Id sản phẩm không hợp lệ!");

        case 23:
          res.redirect("back");

        case 24:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 20]]);
}; // [GET] /admin/products/detail/:id


module.exports.detail = function _callee7(req, res) {
  var find, product;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          find = {
            deleted: false,
            _id: req.params.id
          };
          _context7.next = 4;
          return regeneratorRuntime.awrap(Product.findOne(find));

        case 4:
          product = _context7.sent;

          if (product) {
            _context7.next = 8;
            break;
          }

          req.flash("error", "Product not found!");
          return _context7.abrupt("return", res.redirect("back"));

        case 8:
          res.render("admin/pages/products/detail-product", {
            pageTitle: "Detail Products",
            product: product
          });
          _context7.next = 15;
          break;

        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          req.flash("error", "Product not found!");
          res.redirect("".concat(config.prefixAdmin, "/products"));

        case 15:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 11]]);
};