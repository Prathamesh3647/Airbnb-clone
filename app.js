const express = require("express");
const app = express();
const Listing = require("./models/listing.js"); // reuire from models folder
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schemaValidate.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
//for authentication:
const passport = require("passport");
const LocalStatergy = require("passport-local");
const User = require("./models/user.js");
//for ejs
const path = require("path");

const ExpressError = require("./utils/expressError.js");
const review = require("./models/review.js");
//for ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//for put req
app.use(methodOverride("_method"));
//for ejsmate
app.engine("ejs", ejsMate);
//for join the static files
app.use(express.static(path.join(__dirname, "/public")));

//sessions:
const sessionOptions = {
  secret: "testSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 10 * 24 * 60 * 60 * 1000,
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//require listings from listings.js :Reconstruct
const listingRouter = require("./routes/listings.js");
//require reviews from reviews.js :Reconstruct
const reviewRouter = require("./routes/reviews.js");
//require reviews from user.js :Reconstruct
const userRouter = require("./routes/user.js");

//set up
async function main() {
  await mongoose.connect(MONGO_URL);
}
//starting db:
main()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

//create a first route:
app.get("/", (req, res) => {
  res.send("done");
});

app.use(session(sessionOptions));
app.use(flash());

//Middlewares for authenticate
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

//listings routes: Reconstruct
app.use("/listings", listingRouter);
//reviews routes: Reconstruct
app.use("/listings/:id/reviews", reviewRouter);
//user routes: Reconstruct
app.use("/", userRouter);

// new route for check listing
// app.get("/listing",async (req,res)=>{
//     const SampleListing=new Listing({
//         title:"My new villa",
//         description:"Ny the beach",
//         image:"",
//         price:7000,
//         location:"West Goa",
//         country:"India",
//     });
//     await SampleListing.save();
//     console.log("Sample saved!!");
//     res.send("Sample saved in db");
// });

//middleware
app.use((req, res, next) => {
  //for any route which dosen't exist
  next(new expressError(404, "Page not found !!!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 400, message = "something wen't wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
});

//port:
app.listen(8080, () => {
  console.log("port listening on 8080");
});
