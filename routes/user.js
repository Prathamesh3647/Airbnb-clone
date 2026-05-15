const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{  
        let {username,email,password} = req.body;
        //Creates new Mongoose user object.
        const newUser = new User({username,email});//Password is NOT added manually because Passport handles it securely.
        //save in db
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listings");
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
// This is for authenticate user if didn't go to login and show flash error
router.post("/login",passport.authenticate('local',{failureRedirect:"/login",failureFlash:true}),
    async(req,res)=>{
        req.flash("success","Welcome back !!!");
        res.redirect("/listings");
    }
);

module.exports = router;