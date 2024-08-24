const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/stock.controller");

router.get("/", controller.index);
router.patch("/change-multi", controller.changeMulti);
router.patch("/postSale/:id", controller.postSale);
router.delete("/delete/:id", controller.delete);

module.exports = router;