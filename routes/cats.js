var express = require("express");
var router = express.Router();
var Cat = require("../models/cat");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'maximzh', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//INDEX - show all cats

router.get("/", function (req, res) {
// Get all cats from DB
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Cat.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCats) {
        Cat.count().exec(function (err, count) {
            if (err) {
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


//CREATE - add new cat to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result) {
  // add cloudinary url for the image to the cat object under image property
  req.body.cat.image = result.secure_url;
  // add author to cat
  req.body.cat.author = {
    id: req.user._id,
    username: req.user.username
  }
  Cat.create(req.body.cat, function(err, cat) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/cats/' + cat.id);
  });
});
});

//NEW - show form to create new cat
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("cats/new"); 
});

// SHOW - shows more info about one cat
router.get("/:id", function(req, res){
    //find the cat with provided ID
    Cat.findById(req.params.id).populate("comments").exec(function(err, foundCat){
        if(err || !foundCat){
            req.flash("error", "Cat not found");
            res.redirect("back");
        } else {
            console.log(foundCat)
            //render show template with that cat
            res.render("cats/show", {cat: foundCat});
        }
    });
});

// EDIT CATS ROUTE
router.get("/:id/edit", middleware.checkCatOwnership, function(req, res){
            Cat.findById(req.params.id, function(err, foundCat){
                res.render("cats/edit", {cat: foundCat});   
            });
        });

// UPDATE CATS ROUTE
router.put("/:id", middleware.checkCatOwnership, function(req, res){
    // find and update the correct cat
    Cat.findByIdAndUpdate(req.params.id, req.body.cat, function(err, updatedCat){
        if(err){
            res.redirect("/cats");
        } else {
            res.redirect("/cats/" + req.params.id);    
        }
    });
    // redirect somewhere(show page)
});

// DESTROY CATS ROUTE
router.delete("/:id", middleware.checkCatOwnership, function(req, res){
    Cat.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/cats");
        } else {
            res.redirect("/cats");
        }
    });
});

module.exports = router;