// // MODEL
// const Category = require("../../models/category.model");

// // CONFIG
// const config = require("../../config/system");

// // [GET] /admin/categories
// module.exports.index = async (req, res) => {
//   const categories = await Category.find({ deleted: false });
  
//   res.render("admin/pages/category/index", {
//     pageTitle: "Manage Categories",
//     categories: categories,
//     messages: req.flash()
//   });
// };

// // [POST] /admin/categories/create
// module.exports.create = async (req, res) => {
//   const newCategory = new Category(req.body);
//   await newCategory.save();
  
//   req.flash("success", "Category created successfully!");
//   res.redirect("back");
// };

// // [PATCH] /admin/categories/edit/:id
// module.exports.edit = async (req, res) => {
//   const id = req.params.id;
//   const category = await Category.findOne({ _id: id, deleted: false });

//   if (!category) {
//     req.flash("error", "Category not found!");
//     return res.redirect("back");
//   }

//   res.render("admin/pages/category/edit", {
//     pageTitle: "Edit Category",
//     category: category
//   });
// };

// // [PATCH] /admin/categories/update/:id
// module.exports.update = async (req, res) => {
//   const id = req.params.id;
//   await Category.updateOne({ _id: id }, req.body);
  
//   req.flash("success", "Category updated successfully!");
//   res.redirect("/admin/category");
// };

// // [DELETE] /admin/categories/:id
// module.exports.delete = async (req, res) => {
//   const id = req.params.id;
//   await Category.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
  
//   req.flash("success", "Category deleted successfully!");
//   res.redirect("back");
// };