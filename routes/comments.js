var express = require("express");
var router = express.Router({mergeParams: true});

var Comment = require("../models/comments"),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

// NEW COMMENT - Display a form to add new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE - Add new Comment to the Campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment Added Successfully!!");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
        }
    });
});

// UPDATE ROUTE FOR COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.newComment, function(err) {
        if(err) {
            console.log(err);
        }
        else {
            req.flash("success", "Comment Updated Successfully!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE ROUTE FOR COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err);
        }
        else {
            req.flash("error", "Comment Deleted Successfully!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;