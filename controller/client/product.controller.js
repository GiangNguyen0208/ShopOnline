// MODEL
const Product = require("../../models/product.model");

// HELPER
const formatVNDHelper = require("../../helper/formatVND");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    })
    .sort( { position: "desc" });

    // Format VND
    const numberFormat = formatVNDHelper.numberFormatter();

    const newProduct = products.map(item => {
        const priceNew = (item.price * (100 - item.discountPercentage) / 100) * 23000;
        item.priceNew = numberFormat.format(priceNew);

        const priceFormat = item.price * 23000;
        item.priceFormat = numberFormat.format(priceFormat);

        return item;
    });
    
    res.render("client/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: newProduct
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
          deleted: false,
          slug: req.params.slug
        };
      
        const product = await Product.findOne(find);
      
        if (!product) {
          req.flash("error", "Product not found!");
          return res.redirect("back");
        }
      
        res.render("client/pages/products/detail-product", {
          pageTitle: "Detail Products",
          product: product
        });
      } catch (error) {
        req.flash("error", "Product not found!");
        res.redirect(`/products`);
    }
}