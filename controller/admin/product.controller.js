const Product = require("../../models/product.model");

// HELPER
const filterStatusHelper = require("../../helper/filterStatus");
const filterKeywordHelper = require("../../helper/filterKeyword");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  
  // Filter Status
  const filterStatus = filterStatusHelper(req.query);

  // Điều kiện lọc là sản phẩm chưa bị xóa
  let find = {
    deleted: false
  };

  if(req.query.status) {
    find.status = req.query.status;
  }
  // END FILTER STATUS
  
  // Filter KEYWORD
  const filterKeyword = filterKeywordHelper(req.query, find);
  // END Filter KEYWORK

  const products = await Product.find(find);
  
  res.render("admin/pages/products/index", {
    pageTitle: "Trang quản lý sản phẩm",
    products: products,
    filterStatus: filterStatus,
    filterKeyword: filterKeyword
});
}