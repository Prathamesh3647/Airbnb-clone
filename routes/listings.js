//all listings routes
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // require from models folder
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");

const expressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schemaValidate.js");

//function for validate by Joi
const validateListng = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};
//all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);
//new listing
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);
//save in db or create route
router.post(
  "/",isLoggedIn,
  validateListng,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing added successfully");
    res.redirect("/listings");
  }),
);
//edit route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);
//update route
router.put(
  "/:id",isLoggedIn,
  validateListng,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
  }),
);
// delete route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
  }),
);

module.exports = router;
