// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

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
/*
    // POST route for saving a create a new user
    app.post("/api/user/signup", function(req, res) {
        // create takes an argument of an object describing the item we want to
        // insert into our table. In this case we just we pass in an object with a text
        // and complete property (req.body)
        db.Customer.create({
            customer_name: req.body.customername
        }).then(function(dbCustomer) {
            // We have access to the new burger as an argument inside of the callback function
            res.redirect("/");

        }).catch(function  (error){
            //console.log("Error Message = ", error.message);
            return res.render('error', {
                message: error.message,
                error: error
            });
        });
    });

    // DELETE route for deleting customers. We can get the id of the customers to be deleted from
    // req.params.id
    app.post("/api/deletecustomer", function(req, res) {
        // We just have to specify which burger we want to destroy with "where"
        console.log("cust ID: ", req.body.customerID);
        db.Customer.destroy({
            where: {
                id: req.body.customerID
            }
        }).then(function(dbCustomer) {
            res.redirect("/");
        });
    });*/
};
