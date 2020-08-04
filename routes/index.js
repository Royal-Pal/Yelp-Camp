var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

// SHOW REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register");
}); 

// HANDLE REGISTRATION LOGIC
router.post("/register", function(req, res) {
    var newUser = new User({
                    username: req.body.username
                });
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// ADD LOGIN ROUTES
router.get("/login", function(req, res) {
    res.render("login");
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logOut();
    req.flash("success", "Logged You Out!!");
    res.redirect("/campgrounds");
});

module.exports = router;