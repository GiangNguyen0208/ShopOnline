const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/stock.controller");

router.get("/", controller.index);
router.patch("/postSale/:id", controller.postSale);

module.exports = router;