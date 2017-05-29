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
        var hbsObject = {};
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
                db.Family.findAll({
                    include : [
                        {
                            model: db.Personfamily,
                            required: true,
                            where: {
                                PersonId: req.body.personId
                            }
                        }
                    ]
                }).then(function(dbFamily) {
                    console.log('got to find family');
                    console.log('dbFamily length = ', dbFamily.length);
                    if(dbFamily.length === 0)
                    {
                        hbsObject = {
                            person: dbPerson
                        };
                    }
                    else if(dbFamily.length > 1)
                    {
                        hbsObject = {
                            person: dbPerson,
                            family: dbFamily
                        };
                    }
                    else
                    {
                        // family length is 1, look for chatrooms
                        console.log("Family id = ", dbFamily[0].id);

                        db.ChatRoom.findAll({ where: {'FamilyId' :  dbFamily[0].id }}).then(function(dbChatRoom){
                            //console.log('got to find chatroom');
                            //console.log('dbChatRoom length = ', dbChatRoom.length);
                            //console.log('dbChatRoom = ', dbChatRoom);

                            if(dbChatRoom.length > 0) {
                                hbsObject = {
                                    person: dbPerson,
                                    family: dbFamily,
                                    chatroom: dbChatRoom
                                };
                            }
                        });
                    }

                    res.render('dashboard', hbsObject);
                });
            });
        }).catch(function (error) {
            console.log("Error Message = ", error);
            return done(null, false, req.flash("createFamilyError", error));
        });
    });

    /**
     * process the join family form
     */
    app.post('/api/family/join', isLoggedIn, function(req, res) {
        var hbsObject = {};
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
               return done(null, false, req.flash("familyFindError", "Invalid Family"));
           }
           if(dbfamily.name === req.body.famname &&
              dbfamily.secret_key === req.body.secretKey)
           {
               //add person to personfamily table
               db.Personfamily.create({
                   PersonId: req.body.personId,
                   FamilyId: family.id
               }).then(function (dbPersonFamily) {
                   // Get user info to send to dashboard handlebars
                   db.Person.findOne({where: {'id': req.body.personId}}).then(function (dbPerson) {
                       db.Family.findAll({
                           include: [
                               {
                                   model: db.Personfamily,
                                   required: true,
                                   where: {
                                       PersonId: req.body.personId
                                   }
                               }
                           ]
                       }).then(function (dbFamily) {
                           console.log('got to find family');
                           console.log('dbFamily length = ', dbFamily.length);
                           if (dbFamily.length === 0) {
                               hbsObject = {
                                   person: dbPerson
                               };
                           }
                           else if (dbFamily.length > 1) {
                               hbsObject = {
                                   person: dbPerson,
                                   family: dbFamily
                               };
                           }
                           else {
                               // family length is 1, look for chatrooms
                               console.log("Family id = ", dbFamily[0].id);

                               db.ChatRoom.findAll({where: {'FamilyId': dbFamily[0].id}}).then(function (dbChatRoom) {
                                   console.log('got to find chatroom');
                                   console.log('dbChatRoom length = ', dbChatRoom.length);
                                   console.log('dbChatRoom = ', dbChatRoom);

                                   if (dbChatRoom.length > 0) {
                                       var hbsObject = {
                                           person: dbPerson,
                                           family: dbFamily,
                                           chatroom: dbChatRoom
                                       };
                                   }
                               });
                           }

                           res.render('dashboard', hbsObject);
                       }); // dbFamily
                   }); // end dbPerson
               }).catch(function (error) {
                   console.log("Error Message = ", error);
                   return done(null, false, req.flash("createPersonFamilyError", "Error adding to person family"));
               });
           }
           else {
               return done(null, false, req.flash("familyFindError", "Invalid Family"));
           }
        }).catch(function (error) {
            console.log("Error Message = ", error);
            return done(null, false, req.flash("createFamilyError", error));
        });
    });

    /**
     * process get one family
     */
    app.get('/api/family/getone', isLoggedIn, function(req, res) {

        var personId = req.query.personId;
        var familyId = req.query.familyId;

        console.log('got to getone');
        var hbsObject = {};
        db.Family.findOne({ where: {'id' :  familyId }}).then(function(dbFamily) {
            db.Person.findOne({ where: {'id' : personId}}).then(function(dbPerson){
                db.ChatRoom.findAll({ where: {'FamilyId' :  familyId }}).then(function(dbChatRoom){
                    //console.log('got to find chatroom');
                    //console.log('dbChatRoom length = ', dbChatRoom.length);
                    //console.log('dbChatRoom = ', dbChatRoom);

                    if(dbChatRoom.length > 0) {
                        hbsObject = {
                            person: req.user,
                            family: dbFamily,
                            chatroom: dbChatRoom
                        };
                    }
                    else
                    { // chatrooms
                        hbsObject = {
                            person: req.user,
                            family: dbFamily
                        };
                    }
                    console.log('get one family = ', hbsObject);
                    res.render('dashboard', hbsObject);
                });
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
