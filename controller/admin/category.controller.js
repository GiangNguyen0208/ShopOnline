// MODEL
const Category = require("../../models/category.model");

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
      pagination: categoryPagination, // Fixed variable name
      select: select,
      path: path,
      messages: req.flash()
    });
  };

// [POST] /admin/categories/create
module.exports.create = async (req, res) => {
  const newCategory = new Category(req.body);
  await newCategory.save();
  
  req.flash("success", "Category created successfully!");
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