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

    // process the create family form
    app.post('/api/family/create', isLoggedIn, function(req, res) {
        console.log('create family');
        db.Family.create({
            name: req.body.famname,
            secret_key: req.body.secretKey,
            PersonId: req.body.personId
        }).then(function (dbFamily) {
            console.log('Successfully created family');
            // update personfamily table
            db.Personfamily.create({
                PersonId: req.body.personId,
                FamilyId: dbFamily.id
            }).then(function (dbPersonfamily) {
                console.log('Successfully created personfamily');
            }).catch(function (error) {
                console.log("Error Message = ", error);
                return done(null, false, req.flash("createPersonfamilyError", error));
            });
            // Get user info to send to dashboard handlebars
            db.Person.findOne({ where: {'id' :  req.body.personId }}).then(function(dbPerson) {
                var options = { include:   [  {model:db.Personfamily, as: pf},
                    {model: db.Family, as: f},
                    {model: db.Person, as: p}]
                };
                options.where = {};
                options.where.PersonId = req.body.personId;

                db.Family.findAll(options).then(function(dbFamily) {
                    var options2 = { include:   [  {model:db.Family, as: f},
                        {model: db.ChatRoom, as: cr}]
                    };
                    options.where = cr.FamilyId = f.id;

                    db.ChatRoom.findAll(options2).then(function (dbChatRoom) {
                        var hbsObject = {
                            person: dbPerson,
                            family: dbFamily,
                            chatroom: dbChatRoom
                        };
                        res.render('dashboard', hbsObject);
                    });
                });
            });
        }).catch(function (error) {
            console.log("Error Message = ", error);
            return done(null, false, req.flash("createFamilyError", error));
        });
    });

    // process the join family form
    app.post('/api/family/join', isLoggedIn, function(req, res) {
        console.log('join family');
        // verify if family exists and user has correct credentials to join
        db.Family.findOne({
            where: {
                name: req.body.famname,
                secret_key: req.body.secretKey
            }
        }).then(function(family){
           if(!family)
           {
               return done(null, false, req.flash("familyFindError", "Invalid Family"));
           }
           if(family.name === req.body.famname &&
              family.secret_key === req.body.secretKey)
           {
               //add person to personfamily table
               db.Personfamily.create({
                   PersonId: req.body.personId,
                   FamilyId: family.id
               }).then(function (dbPersonFamily) {
                   res.render('chatroom.ejs', {
                       familyId : family.id, // get the family id out of session and pass to template
                       personId: req.body.personId
                   });
               }).catch(function (error) {
                   console.log("Error Message = ", error);
                   return done(null, false, req.flash("createPersonFamilyError", "Error adding to person family"));
               });
           }
           else {
               return done(null, false, req.flash("familyFindError", "Invalid Family"));
           }

        });
    });

    app.get('api/family/getone', isLoggedIn, function(req, res) {
        db.Family.findOne({ where: {'id' :  req.body.familyId }}).then(function(dbFamily) {
            db.Person.findOne({ where: {'id' : req.body.personId}}).then(function(dbPerson){
                db.ChatRoom.findAll({}).then(function(dbChatRoom){
                    var hbsObject = {
                        person: dbPerson,
                        family: dbFamily,
                        chatroom: dbChatRoom
                    };
                    res.render('dashboard', hbsObject);
                })
            })
        });
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
