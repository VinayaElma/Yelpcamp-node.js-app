var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");
router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,cmp){
    if(err)
    {
        console.log("something went wrong!");
    }
    else
    {
        console.log("success");
        res.render("campgrounds/index",{campgrounds:cmp,currentuser:req.user});
    }
    });
});



router.get("/campgrounds/new",middleware.isloggedin,function(req, res) {
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req, res) {  //to show information about each campground
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcmp){   //to find the data with id(which is unique and is given by req.params.id)
    
    if(err)
    {
        console.log("something went wrong!");
    }
    else
    {
        console.log("success");
        if (!foundcmp) {
            req.flash("error", "Item not found.");
            return res.redirect("back");
        }
        res.render("campgrounds/show",{campground:foundcmp});
    }
    });
});


router.post("/campgrounds",middleware.isloggedin,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newcampground={name:name,image:image,price:price,description:desc,author:author};
    Campground.create(newcampground,function(err,cmp){
    if(err)
    {
        console.log("something went wrong!");
    }
    else
    {
        console.log("success");
        res.redirect("/campgrounds");
    }
    });
});

router.get("/campgrounds/:id/edit",middleware.checkcampgroundownership,function(req,res){
    Campground.findById(req.params.id,function(err,foundcmp){ 
        if (!foundcmp) {
            req.flash("error", "Item not found.");
            return res.redirect("back");
        }
             res.render("campgrounds/edit",{campground:foundcmp});
        });
});

router.put("/campgrounds/:id",middleware.checkcampgroundownership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcmp){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Edited Successfully!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/campgrounds/:id",middleware.checkcampgroundownership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Deleted Successfully!");
            res.redirect("/campgrounds");
        }
    });

});

module.exports=router;