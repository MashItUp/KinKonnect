// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");
var path = require("path");

// Routes
// =============================================================
module.exports = function(app, passport) {

    // =====================================
    // LOGIN ===============================
    // =====================================
    // process the login form
    app.post('/api/user/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard', // redirect to the secure dashboard section
        failureRedirect: '/index', // redirect back to the signup page if there is an error
        failureFlash: 'Invalid username or password.' // allow flash messages
    }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    app.post('/api/user/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/index', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // =====================================
    // DASHBOARD SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
   app.get('/dashboard', isLoggedIn, function(req,res) {
       console.log("req.user = ", req.user);
       var hbsObject = {};
       console.log('got to db.Family.FindAll');
       db.Family.findAll({
           include : [

               {
                   model: db.Personfamily,
                   required: true,
                   where: {
                       PersonId: req.user.id
                   }
               }
           ]
       }).then(function(dbFamily) {
           console.log('got to find family');
           console.log('dbFamily length = ', dbFamily.length);
           //console.log('dbFamily = ', dbFamily);
            if(dbFamily.length === 0)
            {
                hbsObject = {
                    person: req.user
                };
                res.render('dashboard', hbsObject);
            }
            else if(dbFamily.length > 1)
            {
                hbsObject = {
                    person: req.user,
                    family: dbFamily
                };
                res.render('dashboard', hbsObject);
                //res.json(hbsObject);
            }
            else
            {
                // family length is 1, look for chatrooms
                console.log("Family id = ", dbFamily[0].id);

                db.ChatRoom.findAll({ where: {'FamilyId' :  dbFamily[0].id }}).then(function(dbChatRoom){
                    //console.log('got to find chatroom');
                    console.log('dbChatRoom length = ', dbChatRoom.length);
                    //console.log('dbChatRoom = ', dbChatRoom);

                    if(dbChatRoom.length > 0) {
                        console.log("chatroom length > 0");
                        //console.log("dbFamily after json = ", res);
                        hbsObject = {
                            person: req.user,
                            family: dbFamily,
                            chatroom: dbChatRoom
                        };
                        console.log('after chatroom');
                        //console.log("hbsObject = ",hbsObject);
                        //res.json(hbsObject);
                        res.render('dashboard', hbsObject);
                    }
                    else
                    { // chatrooms
                        hbsObject = {
                            person: req.user,
                            family: dbFamily
                        };
                        //console.log('hbsObject after chatrooms = ', hbsObject);
                        res.render('dashboard', hbsObject);
                    }
                });
            }
       });
   });


    /**
     *
     */
    app.get('/login', function(req, res) {
        res.redirect('/');
    });


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