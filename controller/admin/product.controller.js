const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false  // Lấy ra các Product chưa bị xóa
  })
  
  res.render("admin/pages/products/index", {
    pageTitle: "Trang quản lý sản phẩm",
    products: products
});
}