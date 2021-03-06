// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    // Each of the below routes just handles the HTML page that the user gets sent to.

    // index route loads view.html
    app.get("/", function(req, res) {
        // GET route for main page
       //res.render('index.html', { message: req.flash('loginMessage') });
        //res.sendFile(path.join(__dirname, "../index.html"));
        //res.render('index'); // load the index.handlebars file
        res.render('index', { message: req.flash('signupMessage'), user: req.user });
    });


    app.get("/index", function(req, res) {
        // GET route for main page
        //res.render('index.html', { message: req.flash('loginMessage') });
        //res.sendFile(path.join(__dirname, "../index.html"));
        //res.render('index'); // load the index.handlebars file
        res.render('index', { message: req.flash('signupMessage') });
    });
};


