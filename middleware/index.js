var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middlewareObj={};

middlewareObj.checkcampgroundownership=function(req,res,next){
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id,function(err,foundcmp){  
            if(err)
            {
                req.flash("error","Campground not found!");
                res.redirect("back");
            }
            else
            {
                if (!foundcmp) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundcmp.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","Permission denied!");
                    res.redirect("back");
                }
            }
            });
    
    }
    else
    {
        req.flash("error","Please Login!");
        res.redirect("back");
    }
}

middlewareObj.checkcommentownership=function(req,res,next){
    if(req.isAuthenticated())
    { 
        Comment.findById(req.params.commentid,function(err,foundcomment){  
            if(err)
            {
                res.redirect("back");
            }
            else
            { 
                if(foundcomment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error","Permission denied!");
                    res.redirect("back");
                }
            }
            });
    
    }
    else
    {
        req.flash("error","Please Login!");
        res.redirect("back");
    }
}

middlewareObj.isloggedin=function(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","Please Login!");
    res.redirect("/login");
}

module.exports=middlewareObj;