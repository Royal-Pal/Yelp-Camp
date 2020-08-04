var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comments");

var data =[
    {
        name: "Snapwire Forest",
        image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Mountain Ranges",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Sangana Valley",
        image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
];

function seedDB() {
    // Remove all Campgrounds
    Campground.deleteMany({}, function(err) {
        if(err) {
            console.log(err);
        }
        console.log("Removed Campground");

        // Add few Campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("Campground added");

                    // Create a Comment
                    Comment.create(
                        {
                            text: "This place is Great, No need of internet.",
                            author: "Royal Pal"
                        },
                        function(err, comment) {
                            if(err) {
                                console.log(err);
                            }
                            else {
                                // console.log(comment);
                                campground.comments.push(comment);
                                campground.save();
                            }
                        }
                    );
                }
            });
        });
    });
};

module.exports = seedDB;