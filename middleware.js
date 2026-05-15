module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","User must logged in");
        return res.redirect("/login");
    }
    next();
}