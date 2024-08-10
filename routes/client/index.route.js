const productRoutes =  require("./product.route");
const homeRoutes = require("./home.route")
const contactRoutes = require("./contact.route");

module.exports = (app) => {
    app.use("/", homeRoutes);
    app.use("/products", productRoutes);
    app.use("/contact", contactRoutes);
}

