var mongoose = require("mongoose");
var Cat      = require("./models/cat");
var Comment  = require("./models/comment");

var data = [
    {
                name: "Whiskers",
                age: 24,
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
                description: "A playful tabby who loves cuddles and chasing toys.",
                author: {
                                id: "588c2e092403d111454fff76",
                                username: "Admin"
                }
    },
    {
                name: "Luna",
                age: 12,
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Kittyply_edit1.jpg/1200px-Kittyply_edit1.jpg",
                description: "A calm and gentle black cat who enjoys sunny windowsills.",
                author: {
                                id: "588c2e092403d111454fff76",
                                username: "Admin"
                }
    },
    {
                name: "Oliver",
                age: 36,
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg",
                description: "An adventurous orange tabby looking for a loving home.",
                author: {
                                id: "588c2e092403d111454fff76",
                                username: "Admin"
                }
    }
    ];

function seedDB(){
        Cat.deleteMany({}, function(err){
                    if(err){
                                    console.log(err);
                    }
                    console.log("Removed cats!");
                    data.forEach(function(seed){
                                    Cat.create(seed, function(err, cat){
                                                        if(err){
                                                                                console.log(err);
                                                        } else {
                                                                                console.log("Added a cat: " + cat.name);
                                                                                Comment.create({
                                                                                                            text: "Such a beautiful cat!",
                                                                                                            author: { id: "588c2e092403d111454fff76", username: "Admin" }
                                                                                    }, function(err, comment){
                                                                                                            if(err){
                                                                                                                                            console.log(err);
                                                                                                                } else {
                                                                                                                                            cat.comments.push(comment);
                                                                                                                                            cat.save();
                                                                                                                                            console.log("Created a comment");
                                                                                                                }
                                                                                    });
                                                        }
                                    });
                    });
        });
}

module.exports = seedDB;
