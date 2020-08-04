var express = require("express");
var router  = express.Router();
var NodeGeoCoder = require("node-geocoder");

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeoCoder(options);

var Campground = require("../models/campground"),
    middleware = require("../middleware");

router.get("/", function(req, res) {
    res.render("landing");
});

// INDEX - display a list of all campgrounds
router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// NEW - Display a form to make new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    // console.log(user);
    res.render("campgrounds/new");
});

// CREATE - Add new campground to DB
router.post("/campgrounds", middleware.isLoggedIn, function(req,res) {
    // Get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;

    console.log(req.body.location);
    console.log(geocoder.geocode(req.body.location));
    
    geocoder.geocode(req.body.location, function(err, data) {
        console.log(data);
        if(err || !data.length) {
            req.flash("error", "Invalid Location!");
            return res.redirect("back");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;

        var newCampground = {name: name,
            image: image,
            price: price,
            location: location,
            lat: lat,
            lng: lng,
            description: description,
            author: {
                id: req.user._id,
                username: req.user.username
                }
            };
        
        Campground.create(newCampground, function(err, campground) {
        if(err) {
            console.log(err);
        } 
        else {
            req.flash("success", "Campground Added Successfully!!");
            // Redirect to campgound page
                res.redirect("/campgrounds");
        }
        });
    });
});

// SHOW - show info about one campground
router.get("/campgrounds/:id", function(req, res) {
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        }
        else {
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      if (err || !data.length) {
        req.flash('error', 'Invalid address!!');
        return res.redirect('back');
      }
      req.body.campground.lat = data[0].latitude;
      req.body.campground.lng = data[0].longitude;
      req.body.campground.location = data[0].formattedAddress;
  
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Campground Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });

// DELETE CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        }
        else {
            req.flash("success", "Campground Deleted Successfully!!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;