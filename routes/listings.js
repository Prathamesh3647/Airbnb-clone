//all listings routes
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // require from models folder
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schemaValidate.js");

const listingControllers=require("../controllers/listings.js");

//all listings
router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingControllers.addListing)
  );//save in db or create route

//new listing
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListings))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingControllers.updateListing))
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingControllers.destroyListing)
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing),
);

module.exports = router;
