// KinKonnect Application Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var passport = require('passport');
var flash    = require('connect-flash');
var helpers = require('handlebars-helpers')();

var morgan   = require('morgan');
var session      = require('express-session');

//  *******   ADD OTHER DEPENDENCIES HERE   **************

// Set up for the Express App
var app = express();

// Needed for Heroku deployment
const PORT = process.env.PORT || 3000;
// Requires models js files
var db = require("./models");

require('./config/passport')(passport); // pass passport for configuration

//  { extended: true } allows for qs library use for parsing (instead of querystring)
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the 
//  application directory.   process.cwd() used for sequelize
app.use(express.static(process.cwd() + "/public"));

var exphbs = require("express-handlebars");
var Handlebars = require('handlebars');

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// required for passport
app.use(session({
    secret: '2Z7iL8l065Zsc0WT07cu',
    resave: true,
    saveUninitialized: true})); // session secret
//app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// Need to add the other api-routes here
require("./routes/html-routes.js")(app);
require("./routes/user-api-routes.js")(app, passport);


db.sequelize.sync({ force: false }).then(function() {
	app.listen(PORT, function() {
	  console.log("App listening on PORT " + PORT);
	});
});