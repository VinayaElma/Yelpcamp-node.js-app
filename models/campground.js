var mongoose=require("mongoose");
var campgroundschema= new mongoose.Schema({
    name:String,
    price:String,
    createdAt: { type: Date, default: Date.now },
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"Comment"
        }
        ]
});
module.exports=mongoose.model("Campground",campgroundschema);
