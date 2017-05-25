// config/passport.js

var bCrypt   = require('bcrypt-nodejs');

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
//var User            = require('../models/person');
var db = require("../models");

// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serializeuser');
        console.log('serial user id = ', user.id);
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser');
        db.Person.findById(id).then(function(user) {

            if (user) {

                done(null, user.get());

            } else {

                done(user.errors, null);

            }

        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            firstNameField : 'fname',
            lastNameField  : 'lname',
            usernameField : 'email',
            passwordField : 'password',
            dobField : 'dob',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
            function(req, email, password, done) {
                // asynchronous
                // User.findOne wont fire unless data is sent back
                process.nextTick(function() {
                    console.log('nextTick signup');
                    // find a user whose email is the same as the forms email
                    // we are checking to see if the user trying to login already exists
                    db.Person.findOne({ where: {'email' :  email }}).then(function(user) {
                        console.log("got past findOne");
                        console.log('user =', user);
                        // check to see if theres already a user with that email
                        if (user)
                        {
                            console.log('user exists = ', user.email);
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        }
                        else
                        {
                            console.log("didn't find user");
                            db.Person.create({
                                first_name: req.body.fname,
                                last_name: req.body.lname,
                                email: email,
                                password: createHash(password),
                                dob: req.body.dob
                            }).then(function (dbPerson) {
                                console.log('got to then function');
                                // We have access to the new person as an argument inside of the callback function
                                console.log("Registration successfull");
                                return done(null, dbPerson);
                            }).catch(function (error) {
                                console.log("Error Message = ", error);
                                return done(null, false, req.flash("signupMessage", error));
                            });
                        }
                    });
                });
        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // asynchronous
            // db.Person.findOne wont fire unless data is sent back
            process.nextTick(function() {
                console.log('nextTick login');
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                db.Person.findOne({ where: {'email' :  email }}).then(function(user) {
                    console.log('user email =', user.email);
                    if (!user.email) {
                        console.log('user email =', user.email);
                        console.log('login user not found');
                        return done(null, false, req.flash('loginMessage', 'Invalid Email.')); // req.flash is the way to set flashdata using connect-flash
                    }
                    // check to see if theres already a user with that email
                    // if the user is found but the password is wrong
                    if (!isValidPassword(user,password)) {
                        console.log('invalid password');
                        return done(null, false, req.flash('loginMessage', 'Invalid Password.')); // create the loginMessage and save it to session as flashdata
                    }
                    // all is well, return successful user
                    return done(null, user);
                });
            });
        }));
};

// Generates hash using bCrypt
var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidPassword = function(user, password){
    console.log('password entered = ', password);
    console.log('user.password = ', user.password);
    return bCrypt.compareSync(password, user.password);
};