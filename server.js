///////////////
// Dependencies
///////////////

// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3001
// pull Mongodb_url from .env
const { PORT = 3001, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors");
const morgan = require("morgan");

///////////////
// Database connection
///////////////
// Establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
// Connection events
mongoose.connection
.on("open", () => console.log("You're connected to Mongo"))
.on("close", () => console.log("You're disonnected to Mongo"))
.on("error", (error) => console.log(error))

///////////////
// Models
///////////////
const cheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheeses", cheeseSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

//////////
// Routes
//////////

// create a test route
app.get("/", (req, res) => {
    res.send("Hello, world!")
});

// Cheeses Index Route
app.get("/cheeses", async (req, res) => {
    try {
        // send all Cheeses
        res.json(await Cheese.find({}));
    } catch (error) {
        res.status(400).json(error);
    };
});

// Cheeses Create Route
app.post("/cheeses", async (req, res) => {
    try {
        // send all cheeses
        res.json(await Cheese.create(req.body));
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
});

// Cheeses Update Route
app.put("/cheeses/:id", async(req, res) => {
    try {
        // send all cheeses
        res.json(
            await Cheese.findByIdAndUpdate(req.params.id, req.body, { new: true})
        );
    } catch (error) {
        // send error
        res.status(400).json(error);
    };
});

// Cheeses Delete Route
app.delete("/cheeses/:id", async (req, res) => {
    try {
        // send all cheeses
        res.json(await Cheese.findByIdAndDelete(req.params.id))
    } catch (error) {
        // send error
        res.status(400).json(error);
    }
})

///////////////
// Listener
///////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));

