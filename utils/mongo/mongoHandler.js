const mongoose = require("mongoose");

function connectMongoose() {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
        console.log("MongoDB connection error", err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnnected");
    });

    console.log("Connecting to MongoDB...");
    mongoose.connect("mongodb://localhost:27017/pollination", { useNewUrlParser: true });
}

module.exports = {
    connectMongoose,
};