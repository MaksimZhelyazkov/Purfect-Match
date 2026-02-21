var express    = require("express");
var router     = express.Router({mergeParams: true});
var Cat        = require("../models/cat");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res){
        Cat.findById(req.params.id, function(err, cat){
                    if(err){
                                    console.log(err);
                    } else {
                                     res.render("comments/new", {cat: cat});
                    }
        });
});

// Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
        Cat.findById(req.params.id, function(err, cat){
                    if(err){
                                    console.log(err);
                                    res.redirect("/cats");
                    } else {
                                    Comment.create(req.body.comment, function(err, comment){
                                                        if(err){
                                                                                req.flash("error", "Something went wrong");
                                                                                console.log(err);
                                                        } else {
                                                                                comment.author.id = req.user._id;
                                                                                comment.author.username = req.user.username;
                                                                                comment.save();
                                                                                cat.comments.push(comment);
                                                                                cat.save();
                                                                                req.flash("success", "Successfully added comment");
                                                                                res.redirect("/cats/" + cat._id);
                                                        }
                                    });
                    }
        });
});

// Comments edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
        Cat.findById(req.params.id, function(err, foundCat){
                    if(err || !foundCat){
                                    req.flash("error", "Cat not found");
                                    return res.redirect("back");
                    }
                    Comment.findById(req.params.comment_id, function(err, foundComment){
                                    if(err){
                                                        res.redirect("back");
                                    } else {
                                                        res.render("comments/edit", {cat_id: req.params.id, comment: foundComment});
                                    }
                    });
        });
});

// Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
                    if(err){
                                    res.redirect("back");
                    } else {
                                    res.redirect("/cats/" + req.params.id);
                    }
        });
});

// Comment destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
        Comment.findByIdAndRemove(req.params.comment_id, function(err){
                    if(err){
                                    res.redirect("back");
                    } else {
                                    req.flash("success", "Comment deleted");
                                    res.redirect("/cats/" + req.params.id);
                    }
        });
});

module.exports = router;
