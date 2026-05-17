const mongoose= require("mongoose");
const Review=require("./review.js");
const { listingSchema } = require("../schemaValidate.js");

const Schema =mongoose.Schema;//instead of mongoose.Schema we can use Schema
const ListingSchema=new Schema({
    title:{
        type:String,
        required:true,

    },
    description:{
        type:String,
    },
    image:{
    type:String,
    set:(v)=>v==="" 
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
ListingSchema.post("findOneAndDelete", async (listing) => {

    if (listing) {

        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });

    }

});

const Listing=mongoose.model("Listing",ListingSchema); //Listing is a new model we need to export this
module.exports=Listing;


