// KinKonnect Application Dependencies
var express = require("express");
var bodyParser = require("body-parser");

//  *******   ADD OTHER DEPENDENCIES HERE   **************

// Set up for the Express App
var app = express();

// Needed for Heroku deployment
const PORT = process.env.PORT || 3000;
// Requires models js files
var db = require("./models");

//  { extended: true } allows for qs library use for parsing (instead of querystring)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the 
//  application directory.   process.cwd() used for sequelize
app.use(express.static("./public"));

// Need to add the other api-routes here
//require("./routes/user-api-routes.js")(app);
require("./routes/test-api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync({ force: true }).then(function() {
	app.listen(PORT, function() {
	  console.log("App listening on PORT " + PORT);
	});
});