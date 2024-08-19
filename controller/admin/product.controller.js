// MODEL
const Product = require("../../models/product.model");

// HELPER
const filterStatusHelper = require("../../helper/filterStatus");
const filterKeywordHelper = require("../../helper/filterKeyword");
const formatVNDHelper = require("../../helper/formatVND");
const paginationHelper = require("../../helper/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {

  // Format VND
  const numberFormat = formatVNDHelper.numberFormatter();
  
  // Filter Status
  const filterStatus = filterStatusHelper(req.query);

  // Filter Condition
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

  // Product Count
  const countProduct = await Product.countDocuments(find);

  // Pagination 
  const productPagination = paginationHelper(
    {
    currentPage: 1,
    limitItem: 5
    },
    req.query,
    countProduct
  );
  // END Pagination

  // Return Product
  const products = await Product.find(find).limit(productPagination.limitItem).skip(productPagination.skip);

  // Format price to VND
   const newProduct = products.map(item => {
        const priceNew = (item.price * (100 - item.discountPercentage) / 100) * 23000;
        item.priceNew = numberFormat.format(priceNew);

        const priceFormat = item.price * 23000;
        item.priceFormat = numberFormat.format(priceFormat);

        return item;
    });
  
  res.render("admin/pages/products/index", {
    pageTitle: "Trang quản lý sản phẩm",
    products: products,
    filterStatus: filterStatus,
    filterKeyword: filterKeyword,
    pagination: productPagination
  });
};

// [PATCH] /admin/products/change-status
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;  

  await Product.updateOne({_id: id}, {status: status});

  res.redirect("back");

};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  console.log(req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  let updateStatus;
  switch (type) {
    case "active":
      updateStatus = "active";
      break;
    case "inactive":
      updateStatus = "inactive";
      break;
    default:
      break;
  }

  const updatedProducts = await Product.updateMany(
    { _id: { $in: ids } }, // Điều kiện tìm kiếm
    { status: updateStatus }, // Cập nhật status
    { null: false }
  );
  
  res.redirect("back");
};