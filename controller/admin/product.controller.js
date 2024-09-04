// MODEL
const Product = require("../../models/product.model");

// CONFIG
const config = require("../../config/system");

// HELPER
const filterStatusHelper = require("../../helper/filterStatus");
const filterKeywordHelper = require("../../helper/filterKeyword");
const formatVNDHelper = require("../../helper/formatVND");
const paginationHelper = require("../../helper/pagination");


// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Define path
  const path = config.prefixAdmin + "/products";

  // Define listActive
  const listActive = ["active", "inactive", "delete-all", "change-position"];

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
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(productPagination.limitItem)
    .skip(productPagination.skip);

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
    pagination: productPagination,
    listActive: listActive,
    path: path,
    messages: req.flash()
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;  

  await Product.updateOne({_id: id}, {status: status});

  req.flash("success", "Update item status successfully !!!");

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
      req.flash("success", `Update status successfully ${ids.length} item !!!`);
      break;
    case "inactive":
      updateStatus = "inactive";
      req.flash("success", `Update status successfully ${ids.length} item !!!`);
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, { 
        deleted: true,
        deletedAt: new Date()
      });
      req.flash("success", `Deleted successfully ${ids.length} item !!!`);
      break;
    case "change-position":
      // const positions = new Set();
      for (const item of ids) {
        const [id, position] = item.split("-");
        console.log(`ID: ${id}, Position: ${position}`);  // Debugging line


        await Product.updateOne(
          { _id: id }, 
          { position: parseInt(position, 10) }
        );
      }
      req.flash("success", `Change position successfully ${ids.length} item !!!`);
      break;
    default:
      break;
  }
  
  if (type !== "delete-all" && type !== "change-position") {
    await Product.updateMany(
      { _id: { $in: ids } },
      { status: updateStatus }
    );
  }

  res.redirect("back");
};

// [DELETE] /admin/products/:id
module.exports.delete = async (req, res) => {
  console.log(req.params);
  const id = req.params.id;

  req.flash("success", "Deleted successfully a item !!!");

  // Delete item on view
  await Product.updateOne(
    {_id: id},
    {
      deleted: true,
      deletedAt: new Date()
    }
  );
  res.redirect("back");
};



