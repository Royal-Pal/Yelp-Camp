var Campground = require("../models/campground"),
    Comment    = require("../models/comments");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be Logged In to do that!");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(middlewareObj.isLoggedIn) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if(err) {
                req.flash("error", "Something went Wrong!!!");
                res.redirect("back");
            }
            else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    return next();
                }
                else {
                    req.flash("error", "You are not having Permission for it!!!");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You must be Logged In to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(middlewareObj.isLoggedIn) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Something went Wrong!!!");
                res.redirect("back");
            }
            else if(foundComment.author.id.equals(req.user._id)) {
                return next();
            }
            else {
                req.flash("error", "You are not having Permission for it!!!");
                res.redirect("back");
            }
        });
    }
    else {
        req.flash("error", "You must be Logged In to do that!");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;