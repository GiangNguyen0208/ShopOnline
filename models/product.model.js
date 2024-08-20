const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    { 
        title: String,
        description: String,
        category: String,
        price: Number,
        discountPercentage: Number,
        rating: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        deleted: Boolean,
        deletedAt: Date
    }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;