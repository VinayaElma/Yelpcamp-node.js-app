var express = require("express"),
 app=express(),
 bodyparser= require("body-parser"),
 mongoose=require("mongoose"),
 Campground=require("./models/campground"),
 Comment=require("./models/comment"),
 passport=require("passport"),
localstrategy=require("passport-local"),
passportlocalmongoose=require("passport-local-mongoose"),
User=require("./models/user"),
methodoverride=require("method-override")
flash=require("connect-flash");
app.locals.moment=require("moment"); 
 var campgroundroutes=require("./routes/campgrounds"),
 commentroutes=require("./routes/comments"),
 authroutes=require("./routes/index");
 

 mongoose.connect("mongodb://localhost:27017/yelpcamp",{useNewUrlParser:true});
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());
app.use(require("express-session")({
    secret:"I love u",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());      
passport.deserializeUser(User.deserializeUser()); 


app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use(campgroundroutes); 
app.use(commentroutes);
app.use(authroutes);   

app.set("view engine","ejs"); 

app.listen(3000,function(){
    console.log("YelpCamp has started");
});