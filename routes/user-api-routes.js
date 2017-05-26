// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app, passport) {

    // GET route for getting all of the users
    /*   app.get("/api/allpersons", function(req, res) {
           // findAll returns all entries for a table when used with no options
           db.Person.findAll({}).then(function(dbPerson) {
               // We have access to the todos as an argument inside of the callback function
               res.json(dbPerson);
           });
       });*/

    // =====================================
    // LOGIN ===============================
    // =====================================
    // process the login form
    app.post('/api/user/login', passport.authenticate('local-login', {
        successRedirect: '/index.html', // redirect to the secure profile section
        failureRedirect: '/index.html', // redirect back to the signup page if there is an error
        failureFlash: 'Invalid username or password.' // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    app.post('/api/user/signup', passport.authenticate('local-signup', {
        successRedirect: '../index.html', // redirect to the secure profile section
        failureRedirect: '../index.html', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // =====================================
    // DASHBOARD SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    /*   app.get('/dashboard', isLoggedIn, function(req,res){
           console.log('dashboard');
           console.log('req.req.use = ', req.user);
           console.log('res.json = ', res.json());
           res.render('dashboard.html', {
               user : req.user // get the user out of session and pass to template
           });
       })*/

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log('isLoggedIn');
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}