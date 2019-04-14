var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");


router.get("/campgrounds/:id/comments/new",middleware.isloggedin,function(req,res){
    Campground.findById(req.params.id,function(err,foundcmp){   //to find the data with id(which is unique and is given by req.params.id)
   
   if(err)
   {
       console.log("something went wrong!");
   }
   else
   {
       
       console.log("success");
       res.render("comments/new",{campground:foundcmp});
   }
   });
});

router.post("/campgrounds/:id/comments",middleware.isloggedin,function(req,res){
   Campground.findById(req.params.id,function(err,foundcmp){   
   
   if(err)
   {
       console.log("something went wrong!");
   }
   else
   {
       console.log("success");
   Comment.create(req.body.comment,function(err,comment){  
   
   if(err)
   {
       console.log("something went wrong!");
   }
   else
   {
       console.log("success");
       comment.author.id=req.user._id;
       comment.author.username=req.user.username;
       comment.save();
       foundcmp.comments.push(comment);
       foundcmp.save(function(err,cmp){
           if(err)
           {
               console.log("error");
           }
           else
           {
               console.log("success");
           }
       });
       req.flash("success","Successfully added comment!");
       res.redirect("/campgrounds/"+foundcmp._id);
   }
   });
   }
   });
});

router.get("/campgrounds/:id/comments/:commentid/edit",middleware.checkcommentownership,function(req,res){
    Comment.findById(req.params.commentid, function(err,foundcom){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",{campground_id:req.params.id,comment:foundcom});
        }
    });  
});

router.put("/campgrounds/:id/comments/:commentid",middleware.checkcommentownership,function(req,res){
    Comment.findByIdAndUpdate(req.params.commentid,req.body.comment,function(err,updatedcomment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success","Edited Successfully!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/campgrounds/:id/comments/:commentid",middleware.checkcommentownership,function(req,res){
Comment.findByIdAndRemove(req.params.commentid,function(err){
    if(err)
    {
        res.redirect("back");
    }
    else
    {
        req.flash("success","Deleted Successfully!");
        res.redirect("/campgrounds/"+req.params.id);
    }
});
});


module.exports=router;