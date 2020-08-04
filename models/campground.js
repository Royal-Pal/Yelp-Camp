var mongoose = require("mongoose");

// Schema Setup
var campgoundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    location: String,
    lat: Number,
    lng: Number,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgoundSchema);