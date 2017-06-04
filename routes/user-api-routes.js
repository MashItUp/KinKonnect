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
    app.get('/dashboard/', isLoggedIn, function(req,res) {
        console.log('got to /dashboard');
        console.log('req.query.familyId = ',req.query);
        if(req.query.familyId)
        {
            return res.redirect('/dashboard/' + req.query.familyId);
        }
        var hbsObject = {};

        var options = {include : [

            {
                model: db.Personfamily,
                required: true,
                where: {
                    PersonId: req.user.id
                }
            }
        ]};

        db.Family.findAll(options).then(function(dbFamily) {
            //console.log('dbFamily length = ', dbFamily.length);
            //console.log('req.user = ', req.user);
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
            }
            else
            {
                // family length is 1, look for chatrooms
                //console.log("Family id = ", dbFamily[0].id);
                console.log('REDIRECTED');
                res.redirect('/dashboard/' + dbFamily[0].id);

           /*     db.ChatRoom.findAll({ where: {'FamilyId' :  dbFamily[0].id }}).then(function(dbChatRoom){
                    if(dbChatRoom.length > 0) {
                        hbsObject = {
                            person: req.user,
                            family: dbFamily,
                            chatroom: dbChatRoom
                        };
                        res.render('dashboard', hbsObject);
                    }
                    else
                    { // chatrooms
                        hbsObject = {
                            person: req.user,
                            family: dbFamily
                        };
                        //console.log('object = ', hbsObject)
                        res.render('dashboard', hbsObject);
                    }
                });*/
            }
        });
    });

    /**
     *
     */
    app.get('/dashboard/:familyId', isLoggedIn, function(req,res) {
        console.log('got to :familyId');
        console.log('req.params.familyId = ', req.params.familyId);

        var hbsObject = {};

        var options = {include : [

            {
                model: db.Personfamily,
                required: true,
                where: {
                    PersonId: req.user.id
                }
            }
        ]};

        options.where = {};

        options.where.id = req.params.familyId;

        db.Family.findAll(options).then(function(dbFamily) {
                db.ChatRoom.findAll({ where: {'FamilyId' : req.params.familyId  }}).then(function(dbChatRoom){
                    console.log('after chatroom findall');
                    console.log('chatroom = ', dbChatRoom.length);
                    if(dbChatRoom.length > 0) {
                        hbsObject = {
                            person: req.user,
                            family: dbFamily,
                            chatroom: dbChatRoom
                        };
                        res.render('dashboard', hbsObject);

                    }
                    else
                    { // chatrooms
                        hbsObject = {
                            person: req.user,
                            family: dbFamily
                        };
                        //console.log('object = ', hbsObject)
                        res.render('dashboard', hbsObject);
                    }
                });
        });
    });

    // DELETE route for deleting Chat Rooms. We can get the id of the chat room to be deleted from
    // req.params.id or possibly the req.body
    app.post("/api/chatroom/delete/:crId", isLoggedIn, function(req, res) {
        // We just have to specify which chatroom we want to destroy with "where"
        console.log("req.body.crId: ", req.body.crId);
        var temp_crId = parseInt(req.body.crId);
            db.ChatRoom.destroy({
                where: {
                    // id: req.body.crId
                    id: temp_crId
                }
            }).then(function(dbChatroom) {
                // res.redirect('/dashboard');
                res.redirect('/dashboard');
                // res.redirect('/dashboard');
            });
        // }
    });


    // =====================================
    // LOGIN  ==============================
    // =====================================
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

/**
 * isLoggedIn
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
   // console.log('isLoggedIn');
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}