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
        deletedAt: Date,
        postAt: Date,
        position: Number
    }, { timestamps: true }
);

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;