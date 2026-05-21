const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id); //here listing is selected by id
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review created");
  res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  // remove review id from listing
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  // delete review document
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};
