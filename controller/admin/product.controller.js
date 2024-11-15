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

  // Define Select option
  const select = ["position-desc", "position-asc", "price-desc", "price-asc", "title-desc", "title-asc", ]

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

  // SORT
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  // END SORT

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
    select: select,
    path: path,
    messages: req.flash()
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;  

  await Product.updateOne({_id: id}, {status: status});

  req.flash("success", "Update item status successfully !!!");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
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
      break;
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

// [GET] /admin/products/edit/:id 
module.exports.edit = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
  
    const product = await Product.findOne(find);
  
    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }
  
    res.render("admin/pages/products/edit", {
      pageTitle: "Edit Products",
      product: product
    });
  } catch (error) {
    req.flash("error", "Product not found!");
    res.redirect(`${config.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    console.log(req.body);
    const id = req.params.id;
    if(req.file && req.file.filename) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countProducts = await Product.countDocuments({});
      req.body.position = countProducts + 1;
    }
    await Product.updateOne({
      _id: id,
      deleted: false
    }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "Id sản phẩm không hợp lệ!");
  }
  res.redirect("back");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
  
    const product = await Product.findOne(find);
  
    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }
  
    res.render("admin/pages/products/detail-product", {
      pageTitle: "Detail Products",
      product: product
    });
  } catch (error) {
    req.flash("error", "Product not found!");
    res.redirect(`${config.prefixAdmin}/products`);
  }
}

module.exports.select = async (req, res) => {
  res.send("OK");
}

