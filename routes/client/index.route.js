const express = require('express');

const productRoutes =  require("./product.route");
const homeRoutes = require("./home.route")
const contactRoutes = require("./contact.route");

const router = express.Router();

router.use("/", homeRoutes);
router.use("/products", productRoutes);
router.use("/contact", contactRoutes);

module.exports = router;

