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

    /**
     * process the create family form
     */
    app.post('/api/family/create', isLoggedIn, function(req, res) {
        console.log('create family');
        db.Family.create({
            name: req.body.famname,
            secret_key: req.body.secretKey,
            PersonId: req.user.id
        }).then(function (dbFamily) {

            // update personfamily table
            db.Personfamily.create({
                PersonId: req.user.id,
                FamilyId: dbFamily.id
            }).then(function (dbPersonfamily) {
                console.log('Successfully created personfamily');
            }).catch(function (error) {
                console.log("Error Message = ", error);
                res.status(401).json({message: 'Error Creating Person family'});
            });
            res.redirect('/dashboard/' + dbFamily.id);
        }).catch(function (error) {
            console.log("Error Message = ", error);
            res.status(401).json({message: 'Error Creating Person family '});
        });
    });

    /**
     * process the join family form
     */
    app.post('/api/family/join', isLoggedIn, function(req, res) {
        console.log('join family');
        // verify if family exists and user has correct credentials to join
        db.Family.findOne({
            where: {
                name: req.body.famname,
                secret_key: req.body.secretKey
            }
        }).then(function(dbfamily){
           if(!dbfamily)
           {
               // return done(null, false, req.flash("familyFindError", "Invalid Family"));
               res.status(401).json({message: 'Invalid Family '});
           }
           if(dbfamily.name === req.body.famname &&
              dbfamily.secret_key === req.body.secretKey)
           {
               //add person to personfamily table
               db.Personfamily.create({
                   PersonId: req.user.id,
                   FamilyId: dbfamily.id
               }).then(function (dbPersonFamily) {

                   res.redirect('/dashboard/' + dbfamily.id);

               }).catch(function (error) {
                   console.log("Error Message = ", error);
                  res.status(401).json({message: 'Error creating person/family'});
               });
           }
           else
           {
               console.log("Cannot join family");
              res.status(401).json({message: 'Cannot join family - Error secret key/family name '});
           }
        }).catch(function (error) {
            console.log("Error Message = ", error);
            res.status(401).json({message: 'Error finding family'});
        });
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
    console.log('isLoggedIn');
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
