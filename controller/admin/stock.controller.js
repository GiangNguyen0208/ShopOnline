// MODEL
const Product = require("../../models/product.model");

// CONFIG
const config = require("../../config/system");

// HELPER
const filterStatusHelper = require("../../helper/filterStatus");
const filterKeywordHelper = require("../../helper/filterKeyword");
const formatVNDHelper = require("../../helper/formatVND");
const paginationHelper = require("../../helper/pagination");
const system = require("../../config/system");

// [GET] /admin/stocks
module.exports.index = async (req, res) => {
    // Define path
    const path = config.prefixAdmin + "/stocks";

    // Define list Active
    const listActive = ['post','delete-all'];

    // Format VND
    const numberFormat = formatVNDHelper.numberFormatter();
    
    // Filter Status
    const filterStatus = filterStatusHelper(req.query);
  
    // Filter Condition
    let find = {
      deleted: true
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
    
    res.render("admin/pages/stock/index", {
      pageTitle: "Product warehouse",
      products: newProduct,
      filterStatus: filterStatus,
      filterKeyword: filterKeyword,
      pagination: productPagination,
      listActive: listActive,
      path: path
    });
};

// [PATCH] /admin/stocks/postSale/:id
module.exports.postSale = async (req, res) => {
  const id = req.params.id;
  // Delete item on view
  await Product.updateOne(
    {_id: id},
    {
      deleted: false,
      postAt: new Date()
    }
  );
  res.redirect("back");
};

// [PATCH] /admin/stocks/change-multi
module.exports.changeMulti = async (req, res) => {
  console.log(req.body); // Kiểm tra dữ liệu gửi lên
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  let deleteStatus;
  switch (type) {
      case "post":
          deleteStatus = false;
          break;
      case "delete-all":
          await Product.deleteMany({ _id: { $in: ids } });
          break;
      default:
          return res.status(400).send("Invalid type provided.");
  }

  if (type === "post") {
      await Product.updateMany(
          { _id: { $in: ids } }, // Condition to find documents
          { deleted: deleteStatus }, // Update field to mark as not deleted
      );
  }

  res.redirect("back");
};

// [DELETE] /admin/stocks/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  req.flash("success", "Deleted successfully a item !!!");
  // Delete item on view
  await Product.deleteOne(
    {_id: id}
  );
  res.redirect("back");
};

// [GET] /admin/stocks/create
module.exports.create = async (req, res) =>{
  res.render("admin/pages/stock/create", {
    pageTitle: "Add New Products",
    messages: req.flash(),
    prefixAdmin: '/admin'
  });
};

// [POST] /admin/stocks/createPost
module.exports.createPost = async (req, res) =>{
  console.log(req.body);
  console.log(req.file);

  const existingPosition = await Product.findOne({ position: req.body.position });
  
  // Check if position is empty and set to the next available position
  if (!req.body.position || existingPosition) {
    const maxPosition = await Product.findOne({}, {}, { sort: { position: -1 } });
    req.body.position = maxPosition ? maxPosition.position + 1 : 1; // Increment position
  }

  const newProduct = new Product({
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

  await newProduct.save();

  req.flash("success", "Upload Product successfully !!!");

  res.redirect(`${config.prefixAdmin}/stocks`);
};