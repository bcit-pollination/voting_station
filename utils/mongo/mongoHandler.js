const mongoose = require('mongoose');

function connectMongoose() {
    mongoose.connect('mongodb://127.0.0.1/pollination').then(value => {
        console.log("Connected to mongo...");
    }).catch(err => {
        console.log("Connection failed to mongo...", err);
    });

    mongoose.connection.on('error', err => {
        console.log("Mongo connection error", err);
    })
}

module.exports = {
    connectMongoose
}