module.exports.isLoggedIn = (re,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","User must logged in");
        return res.redirect("/login");
    }
    next();
}