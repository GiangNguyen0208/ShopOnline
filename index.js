const express = require("express");
require("dotenv").config();

const database = require("./config/database");

const route = require("./routes/client/index.route");

const products = require("./controller/client/product.controller");

// Connect database
database.connect();

// Show log products
// products.index();


const app = express();
const port = process.env.PORT;


app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// Routes
route(app)

app.listen(port, () => {
  console.log(`Đã chạy thành công vào cổng ${port}`);
});
