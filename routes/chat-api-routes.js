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
            PersonId: req.user.id,
            FamilyId: req.body.familyId
        }).then(function (dbChatroom) {
            console.log('Successfully created chat room');
            res.redirect('/dashboard?familyId=' + req.body.familyId);
        }).catch(function (error) {
            console.log("Error Message = ", error);
            // return done(null, false, req.flash("createChatRoomError", error));
            res.status(401).json({message: 'Error Creating Chat Room x01'});
        });
    });

//  Create Chat Post (POST Route for Saving Chat Post)
    app.post('/api/chatpost/create', isLoggedIn, function(req, res) {
        console.log('crId = ',req.query.crId );
        // create takes an argument of an object describing the items we want to
        // insert into our table. We pass in an object with text and req.body (complete property)
        db.ChatPost.create({
            body: req.body.chatBody,
            PersonId: req.user.id,
            ChatRoomId: req.body.crId
        }).then(function (dbChatpost) {
            console.log('Successfully created chat post');
            res.redirect('/chatroom/' + req.body.crId);
        }).catch(function (error) {
            console.log("Error Message = ", error);
            // return done(null, false, req.flash("createChatpostError", error));
            res.status(401).json({message: 'Error Creating Chat Post x01'});
        });
    });

    // GET route for getting all of the chatrooms
    app.get("/api/chat/all/:crID", isLoggedIn, function(req, res) {
        // findAll returns all entries for a table when used with no options
        db.Chatroom.findAll({}).then(function(dbChatroom) {
            console.log("dbChatroom", dbChatroom);
            // We have Chatrooms as an argument inside of the callback function
            res.redirect('/chatroom');
        });
    });

    // DELETE route for deleting chatrooms. We can get the id of the chatroom to be deleted from
    // req.params.id
    app.post("/api/api/chat/delete/:crID", isLoggedIn, function(req, res) {
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

    app.get('/chatroom/:crId', isLoggedIn, function(req, res) {

//        console.log("req: ", req);
        //    console.log("MRL req.body: ", req.body, "END OF req.body");
        //  console.log("MRL req.query = ", req.query, "END OF req.query");
        console.log("chatroomId from params: =", req.params.crId);

        var hbsObject = {};

        var options = {include : [

            {
                model: db.ChatRoom,
                // required: false,
                where: {
                    id: req.params.crId
                }
            }
        ]};

        db.ChatPost.findAll(options).then(function(dbChatpost) {
            // db.ChatPost.findAll(options).then(function(dbChatpost) {
            //console.log('dbChatpost length = ', dbChatpost.length);
            //console.log("dbChatpost", dbChatpost);

            db.ChatRoom.findAll({ where: {'id' :  req.params.crId }}).then(function(dbChatroom){
                console.log('dbChatroom = ', dbChatroom);
                hbsObject = {
                    chatPost: dbChatpost,
                    chatRoom: dbChatroom
                };
                // console.log("dbChatpost.ChatRoom: ", dbChatpost.ChatRoom);
                console.log("hbsObject = ", hbsObject);
                res.render('chatroom', hbsObject);
            })
        });
    });
    // });
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