var express        = require("express"),
        app            = express(),
        bodyParser     = require("body-parser"),
        mongoose       = require("mongoose"),
        flash          = require("connect-flash"),
        passport       = require("passport"),
        LocalStrategy  = require("passport-local"),
        methodOverride = require("method-override"),
        User           = require("./models/user");

// Requiring routes
var commentRoutes = require("./routes/comments"),
        catRoutes     = require("./routes/cats"),
        indexRoutes   = require("./routes/index");

mongoose.connect(process.env.DATABASEURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport configuration
app.use(require("express-session")({
        secret: "cats are the best",
        resave: false,
        saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
        next();
});

app.use("/", indexRoutes);
app.use("/cats", catRoutes);
app.use("/cats/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function(){
        console.log("Purfect Match Server Has Started!");
});
