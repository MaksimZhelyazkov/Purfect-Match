var express    = require("express");
var router     = express.Router();
var Cat        = require("../models/cat");
var middleware = require("../middleware");


// INDEX - show all cats
router.get("/", function(req, res){
      var perPage = 8;
      var pageQuery = parseInt(req.query.page);
      var pageNumber = pageQuery ? pageQuery : 1;
      Cat.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allCats){
                Cat.countDocuments().exec(function(err, count){
                              if(err){
                                                console.log(err);
                              } else {
                                                res.render("cats/index", {
                                                                      cats: allCats,
                                                                      current: pageNumber,
                                                                      pages: Math.ceil(count / perPage)
                                                });
                              }
                });
      });
});

// CREATE - add new cat to DB
router.post("/", middleware.isLoggedIn, function(req, res){
      var name        = req.body.name;
      var age         = req.body.age;
      var image       = req.body.image;
      var description = req.body.description;
      var author = {
                id: req.user._id,
                username: req.user.username
      };
      var newCat = {name: name, age: age, image: image, description: description, author: author};
      Cat.create(newCat, function(err, cat){
                if(err){
                              req.flash("error", err.message);
                              return res.redirect("back");
                }
                res.redirect("/cats/" + cat._id);
      });
});

// NEW - show form to create new cat
router.get("/new", middleware.isLoggedIn, function(req, res){
      res.render("cats/new");
});

// SHOW - shows more info about one cat
router.get("/:id", function(req, res){
      Cat.findById(req.params.id).populate("comments").exec(function(err, foundCat){
                if(err || !foundCat){
                              req.flash("error", "Cat not found");
                              res.redirect("back");
                } else {
                              res.render("cats/show", {cat: foundCat});
                }
      });
});

// EDIT cat
router.get("/:id/edit", middleware.checkCatOwnership, function(req, res){
      Cat.findById(req.params.id, function(err, foundCat){
                if(err || !foundCat){
                              req.flash("error", "Cat not found");
                              return res.redirect("/cats");
                }
                res.render("cats/edit", {cat: foundCat});
      });
});

// UPDATE cat
router.put("/:id", middleware.checkCatOwnership, function(req, res){
      Cat.findByIdAndUpdate(req.params.id, req.body.cat, function(err){
                if(err){
                              res.redirect("/cats");
                } else {
                              res.redirect("/cats/" + req.params.id);
                }
      });
});

// DESTROY cat
router.delete("/:id", middleware.checkCatOwnership, function(req, res){
      Cat.findByIdAndDelete(req.params.id, function(err){
                if(err){
                              res.redirect("/cats");
                } else {
                              res.redirect("/cats");
                }
      });
});

module.exports = router;
