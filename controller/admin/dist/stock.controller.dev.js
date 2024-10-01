"use strict";

// MODEL
var Product = require("../../models/product.model"); // CONFIG


var config = require("../../config/system"); // HELPER


var filterStatusHelper = require("../../helper/filterStatus");

var filterKeywordHelper = require("../../helper/filterKeyword");

var formatVNDHelper = require("../../helper/formatVND");

var paginationHelper = require("../../helper/pagination");

var system = require("../../config/system"); // [GET] /admin/stocks


module.exports.index = function _callee(req, res) {
  var path, listActive, select, numberFormat, filterStatus, find, filterKeyword, countProduct, productPagination, products, newProduct;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // Define path
          path = config.prefixAdmin + "/stocks"; // Define list Active

          listActive = ['post', 'delete-all']; // Define Select option

          select = ["position-desc", "position-asc", "price-desc", "price-asc", "title-desc", "title-asc"]; // Format VND

          numberFormat = formatVNDHelper.numberFormatter(); // Filter Status

          filterStatus = filterStatusHelper(req.query); // Filter Condition

          find = {
            deleted: true
          };

          if (req.query.status) {
            find.status = req.query.status;
          } // END FILTER STATUS
          // Filter KEYWORD


          filterKeyword = filterKeywordHelper(req.query, find); // END Filter KEYWORK
          // Product Count

          _context.next = 10;
          return regeneratorRuntime.awrap(Product.countDocuments(find));

        case 10:
          countProduct = _context.sent;
          // Pagination 
          productPagination = paginationHelper({
            currentPage: 1,
            limitItem: 5
          }, req.query, countProduct); // END Pagination
          // Return Product

          _context.next = 14;
          return regeneratorRuntime.awrap(Product.find(find).limit(productPagination.limitItem).skip(productPagination.skip));

        case 14:
          products = _context.sent;
          // Format price to VND
          newProduct = products.map(function (item) {
            var priceNew = item.price * (100 - item.discountPercentage) / 100 * 23000;
            item.priceNew = numberFormat.format(priceNew);
            var priceFormat = item.price * 23000;
            item.priceFormat = numberFormat.format(priceFormat);
            return item;
          });
          res.render("admin/pages/stock/index", {
            pageTitle: "Product warehouse",
            products: newProduct,
            filterStatus: filterStatus,
            filterKeyword: filterKeyword,
            pagination: productPagination,
            listActive: listActive,
            select: select,
            path: path
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
}; // [PATCH] /admin/stocks/postSale/:id


module.exports.postSale = function _callee2(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id; // Delete item on view

          _context2.next = 3;
          return regeneratorRuntime.awrap(Product.updateOne({
            _id: id
          }, {
            deleted: false,
            postAt: new Date()
          }));

        case 3:
          res.redirect("back");

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // [PATCH] /admin/stocks/change-multi


module.exports.changeMulti = function _callee3(req, res) {
  var type, ids, deleteStatus;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(req.body); // Kiểm tra dữ liệu gửi lên

          type = req.body.type;
          ids = req.body.ids.split(", ");
          _context3.t0 = type;
          _context3.next = _context3.t0 === "post" ? 6 : _context3.t0 === "delete-all" ? 8 : 11;
          break;

        case 6:
          deleteStatus = false;
          return _context3.abrupt("break", 12);

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(Product.deleteMany({
            _id: {
              $in: ids
            }
          }));

        case 10:
          return _context3.abrupt("break", 12);

        case 11:
          return _context3.abrupt("return", res.status(400).send("Invalid type provided."));

        case 12:
          if (!(type === "post")) {
            _context3.next = 15;
            break;
          }

          _context3.next = 15;
          return regeneratorRuntime.awrap(Product.updateMany({
            _id: {
              $in: ids
            }
          }, // Condition to find documents
          {
            deleted: deleteStatus
          } // Update field to mark as not deleted
          ));

        case 15:
          res.redirect("back");

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // [DELETE] /admin/stocks/:id


module.exports["delete"] = function _callee4(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          req.flash("success", "Deleted successfully a item !!!"); // Delete item on view

          _context4.next = 4;
          return regeneratorRuntime.awrap(Product.deleteOne({
            _id: id
          }));

        case 4:
          res.redirect("back");

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // [GET] /admin/stocks/create


module.exports.create = function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          res.render("admin/pages/stock/create", {
            pageTitle: "Add New Products",
            messages: req.flash(),
            prefixAdmin: '/admin'
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // [POST] /admin/stocks/createPost


module.exports.createPost = function _callee6(req, res) {
  var existingPosition, maxPosition, newProduct;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log(req.body);
          console.log(req.file);
          _context6.next = 4;
          return regeneratorRuntime.awrap(Product.findOne({
            position: req.body.position
          }));

        case 4:
          existingPosition = _context6.sent;

          if (!(!req.body.position || existingPosition)) {
            _context6.next = 10;
            break;
          }

          _context6.next = 8;
          return regeneratorRuntime.awrap(Product.findOne({}, {}, {
            sort: {
              position: -1
            }
          }));

        case 8:
          maxPosition = _context6.sent;
          req.body.position = maxPosition ? maxPosition.position + 1 : 1; // Increment position

        case 10:
          newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: parseInt(req.body.price),
            discountPercentage: req.body.discount,
            stock: req.body.quantity,
            status: req.body.status,
            deleted: true,
            position: req.body.position,
            thumbnail: req.body.thumbnail
          });
          _context6.next = 13;
          return regeneratorRuntime.awrap(newProduct.save());

        case 13:
          req.flash("success", "Upload Product successfully !!!");
          res.redirect("".concat(config.prefixAdmin, "/stocks"));

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  });
};