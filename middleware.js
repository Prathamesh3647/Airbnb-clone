const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError.js");
const { listingSchema,reviewSchema } = require("./schemaValidate.js");

//function for validate by Joi
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};
//validate review by joi:
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //it will get orignal path after clicking on any path
    req.flash("error", "User must logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async(req,res,next)=>{
  let{id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","You are not the owner of listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review does not exist");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
