// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app,  passport) {

    // GET route for getting all of the users
    app.get("/api/allpersons", function(req, res) {
        // findAll returns all entries for a table when used with no options
        db.Person.findAll({}).then(function(dbPerson) {
            // We have access to the todos as an argument inside of the callback function
            res.json(dbPerson);
        });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    // process the signup form
    app.post('/api/user/signup', passport.authenticate('local-signup', {
        successRedirect : '../index.html', // redirect to the secure profile section
        failureRedirect : '../index.html', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/index.html', // redirect to the secure profile section
        failureRedirect : '/index.html', // redirect back to the signup page if there is an error
        failureFlash : 'Invalid username or password.' // allow flash messages
    }));

};
