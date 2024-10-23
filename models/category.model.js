const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
    { 
        name: String,
        description: String,
        stock: Number,
        thumbnail: String,
        status: String,
        deleted: Boolean,
        deletedAt: Date,
        updateAt: Date,
        createdAt: Date,
        position: Number,
        slug: {
            type: String,
            slug: "name",
            unique: true
        }
    }, { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema, "categories");

module.exports = Category;