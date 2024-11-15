// MODEL
const Category = require("../../models/category.model");
const Product = require("../../models/product.model");

// CONFIG
const config = require("../../config/system");

// HELPER
const filterStatusHelper = require("../../helper/filterStatus");
const filterKeywordHelper = require("../../helper/filterKeyword");
const paginationHelper = require("../../helper/pagination");

// [GET] /admin/categories
module.exports.index = async (req, res) => {
    // Define path
    const path = config.prefixAdmin + "/categories";
  
    // Define Select option
    const select = ["position-desc", "position-asc", "price-desc", "price-asc", "title-desc", "title-asc"];
  
    // Define listActive
    const listActive = ["active", "inactive", "delete-all", "change-position"];
  
    // Filter Condition
    const find = {
      deleted: false,
      ...(req.query.status && { status: req.query.status }) // Conditional status filter
    };
  
    // Filter Status
    const filterStatus = filterStatusHelper(req.query);
    
    // Filter KEYWORD
    const filterKeyword = filterKeywordHelper(req.query, find);
  
    // Product Count
    const countCategory = await Category.countDocuments(find);
  
    // Pagination 
    const categoryPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 5
      },
      req.query,
      countCategory
    );
  
    // SORT
    const sort = {
      [req.query.sortKey || "position"]: req.query.sortValue || "desc"
    };
  
    // Return Product
    const categories = await Category.find(find)
      .sort(sort)
      .limit(categoryPagination.limitItem)
      .skip(categoryPagination.skip);
  
    res.render("admin/pages/category/index", {
      pageTitle: "Manage Categories",
      categories: categories,
      listActive: listActive,
      filterStatus: filterStatus,
      filterKeyword: filterKeyword,
      pagination: categoryPagination,
      select: select,
      path: path,
      messages: req.flash()
    });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;  

  await Category.updateOne({_id: id}, {status: status});
  
  const category = await Category.findById(id);
  
  if (status === "inactive") {
    if (category) {
      await Product.updateMany(
        { category: category.name },
        { status: "inactive" }
      );
    }
  } else if (status === "active") {
    if (category) {
      await Product.updateMany(
        { category: category.name },
        { status: "active" }
      );
    }
  }

  req.flash("success", "Update item status successfully !!!");
  res.redirect("back");
};

// [PATCH] /admin/categories/change-multi
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
      await Category.updateMany({ _id: { $in: ids } }, { 
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

        await Category.updateOne(
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
    await Category.updateMany(
      { _id: { $in: ids } },
      { status: updateStatus }
    );
  }

  res.redirect("back");
};  

// [PATCH] /admin/categories/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const category = await Category.findOne({ _id: id, deleted: false });

  if (!category) {
    req.flash("error", "Category not found!");
    return res.redirect("back");
  }

  res.render("admin/pages/category/edit", {
    pageTitle: "Edit Category",
    category: category
  });
};

// [PATCH] /admin/categories/update/:id
module.exports.update = async (req, res) => {
  const id = req.params.id;
  await Category.updateOne({ _id: id }, req.body);
  
  req.flash("success", "Category updated successfully!");
  res.redirect("/admin/category");
};

// [DELETE] /admin/categories/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Category.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
  
  req.flash("success", "Category deleted successfully!");
  res.redirect("back");
};

// [GET] /admin/categories/create
module.exports.create = async (req, res) =>{
  res.render("admin/pages/category/create", {
    pageTitle: "Add New Category",
    messages: req.flash(),
    prefixAdmin: '/admin'
  });
};

// [POST] /admin/categories/createPost
module.exports.createPost = async (req, res) =>{
  console.log(req.body);
  console.log(req.file);

  const existingPosition = await Category.findOne({ position: req.body.position });
  
  // Check if position is empty and set to the next available position
  if (!req.body.position || existingPosition) {
    const maxPosition = await Category.findOne({}, {}, { sort: { position: -1 } });
    req.body.position = maxPosition ? maxPosition.position + 1 : 1; // Increment position
  }

  const newCategory = new Category({
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    // deleted: true,
    position: req.body.position,
    thumbnail: req.body.thumbnail,
    createdAt: new Date()
  });

  await newCategory.save();

  req.flash("success", "Upload Category successfully !!!");

  res.redirect(`${config.prefixAdmin}/categories`);
};

// [GET] /admin/categories/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
  
    const category = await Category.findOne(find);
  
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("back");
    }
  
    res.render("admin/pages/category/detail-category", {
      pageTitle: "Detail Category",
      category: category
    });
  } catch (error) {
    req.flash("error", "Product not found!");
    res.redirect(`${config.prefixAdmin}/categories`);
  }
}
