const express = require('express');
const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const stockRoutes = require("./stock.route");
const categoryRoutes = require("./category.route");

const router = express.Router();
const PATH_ADMIN = systemConfig.prefixAdmin;

router.use("/dashboard", dashboardRoutes);
router.use("/products", productRoutes);
router.use("/stocks", stockRoutes);
// router.use("/category", categoryRoutes);

module.exports = router;