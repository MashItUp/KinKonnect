// KinKonnect Application Dependencies
var express = require("express");
var bodyParser = require("body-parser");

//  *******   ADD OTHER DEPENDENCIES HERE   **************

// Requires models js files
var db = require("./models");
// Set up for the Express App
var app = express();

// Needed for Heroku deployment
const port = process.env.PORT || 3000;

//  { extended: true } allows for qs library use for parsing (instead of querystring)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the 
//  application directory.   process.cwd() used for sequelize
app.use(express.static(process.cwd() + "/public"));

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Need to add the other api-routes here
// require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync({ force: false }).then(function() {
	app.listen(PORT, function() {
	  console.log("App listening on PORT " + PORT);
	});
});