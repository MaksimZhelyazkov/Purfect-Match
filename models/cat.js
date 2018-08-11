var mongoose = require("mongoose");

// SCHEMA SETUP
var catSchema = new mongoose.Schema({
    name: String,
    age: String,
    image: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
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

var cat = mongoose.model("Cat", catSchema);

module.exports = mongoose.model("Cat", catSchema);