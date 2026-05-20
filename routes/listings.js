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
router.get(
  "/",
  wrapAsync(listingControllers.index),
);
//new listing
router.get("/new", isLoggedIn, listingControllers.renderNewForm);
//show route
router.get(
  "/:id",
  wrapAsync(listingControllers.showListings),
);
//save in db or create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingControllers.addListing),
);
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing),
);
//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingControllers.updateListing),
);
// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.destroyListing),
);

module.exports = router;
