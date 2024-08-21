const systemConfig = require("../../config/system");

const dashboardRoutes =  require("./dashboard.route");
const productRoutes = require("./product.route");
const stockRoutes = require("./stock.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    const listActive = ['Activate', 'Deactivate', 'Delete All'];


    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/products", productRoutes);
    app.use(PATH_ADMIN + "/stocks", stockRoutes);
}

