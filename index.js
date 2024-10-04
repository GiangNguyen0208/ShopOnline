const express = require("express");
var path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
require("dotenv").config();

const database = require("./config/database");
const systemConfig = require("./config/system");
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

// Connect to the database
database.connect();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.KEY_FLASH_COOKIE));
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'defaultSecret', 
  resave: false, 
  saveUninitialized: true, 
  cookie: { maxAge: 60000 } 
}));
app.use(flash());
app.use('/uploads', express.static('uploads'));

// New route to the TINYMCE Node Module
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Set up view engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Static files
app.use(express.static(`${__dirname}/public`));

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Routes
app.use('/admin', routeAdmin);
app.use('/', route);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});