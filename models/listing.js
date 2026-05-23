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
        url:String,
        filename:String,
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


