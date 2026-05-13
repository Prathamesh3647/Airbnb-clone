const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

//connection establishment
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

async function main(){     //for set up
    await mongoose.connect(MONGO_URL);
};

main()      //for start db
    .then(()=>{
        console.log("DB connected");
    })
    .catch(()=>{
        console.log(err);
    });

//create a function (async):Initialization of db
const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data initialised");
};

initDB(); // async function called