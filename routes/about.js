var express    = require("express");
var router     = express.Router();
var passport   = require("passport");
var User       = require("../models/user")

router.get("/about",, function(req, res){
    if(err){
            console.log(err);
        } else {
             res.render("/about");
        }
    })
});