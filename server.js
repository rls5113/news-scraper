require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
const logger = require("morgan");

var app = express();
// var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscraper"

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes
// require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
app.use(logger("dev"));


app.listen(8080, function() {
  console.log("App running on port 8080!");
});


module.exports = app;
