//  Dependencies
// Requiring our models	
var db = require("../models");
var path = require("path");

// Routes
// =============================================================
module.exports = function(app, passport) {

//  Create Chat Room (POST Route for Saving Chat Room)
    app.post('/api/chatroom/create', isLoggedIn, function(req, res) {
        console.log('create chat room');
        // create takes an argument of an object describing the items we want to
        // insert into our table. We pass in an object with text and req.body (complete property)
        db.ChatRoom.create({
            name: req.body.crname,
            PersonId: req.body.personId,
            FamilyId: req.body.familyId
        }).then(function (dbChatroom) {
            console.log('Successfully created chatroom');
            res.render('/dashboard', {
                ChatRoomId : dbChatroom.id, // get the family id out of session and pass to template
                PersonId: req.body.personId
            });
        }).catch(function (error) {
            console.log("Error Message = ", error);
            // return done(null, false, req.flash("createChatRoomError", error));
            res.status(401).json({message: 'Error Creating Chat Room '});
        });
    });

    // GET route for getting all of the chatrooms
    app.get("/api/chat/all/:crID", function(req, res) {
        // findAll returns all entries for a table when used with no options
        db.Chatroom.findAll({}).then(function(dbChatroom) {
            console.log("dbChatroom", dbChatroom);
            // We have Chatrooms as an argument inside of the callback function
            res.json(dbChatroom);
        });
    });

    // DELETE route for deleting chatrooms. We can get the id of the chatroom to be deleted from
    // req.params.id
    app.post("/api/api/chat/delete/:crID", function(req, res) {
        // We just have to specify which chatroom we want to destroy with "where"
        console.log("Want to destroy crID: ", crID);
        db.Chatroom.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbChatroom) {
            res.redirect("/dashboard");
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