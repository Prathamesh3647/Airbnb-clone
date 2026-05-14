const mongoose = require("mongoose");
const Schema = mongoose.Schema; //instead of mongoose.Schema we can use Schema
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
    {
        email:{
            type:String,
            required:true
        }
    }
);

User.plugin("passportLocalMongoose");

module.exports = mongoose.model("User",userSchema);