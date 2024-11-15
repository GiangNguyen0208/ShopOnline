"use strict";

var express = require("express");

var path = require('path');

var bodyParser = require('body-parser');

var flash = require('connect-flash');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var methodOverride = require('method-override');

require("dotenv").config();

var database = require("./config/database");

var systemConfig = require("./config/system");

var routeAdmin = require("./routes/admin/index.route");

var route = require("./routes/client/index.route"); // Connect to the database


database.connect();
var app = express();
var port = process.env.PORT || 3000; // Middleware

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser(process.env.KEY_FLASH_COOKIE));
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}));
app.use(flash());
app.use('/uploads', express["static"]('uploads')); // New route to the TINYMCE Node Module

app.use('/tinymce', express["static"](path.join(__dirname, 'node_modules', 'tinymce'))); // Set up view engine

app.set("views", "".concat(__dirname, "/views"));
app.set("view engine", "pug"); // Static files

app.use(express["static"]("".concat(__dirname, "/public"))); // App local variables

app.locals.prefixAdmin = systemConfig.prefixAdmin; // Routes

app.use('/admin', routeAdmin);
app.use('/', route); // Start server

app.listen(port, function () {
  console.log("Server is running on http://localhost:".concat(port));
});