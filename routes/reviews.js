const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams helps to access values from parent route it means we can fetch id on line no 23
const { reviewSchema } = require("../schemaValidate.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

//reviews
//post route : add review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); //here listing is selected by id
    let newReview = new Review(req.body.review);
    newReview.author= req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review created");
    res.redirect(`/listings/${listing._id}`);
  }),
);
// delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor, 
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // remove review id from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // delete review document
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
