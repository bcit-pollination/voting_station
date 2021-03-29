const mongoose = require('mongoose');
const { Schema } = mongoose;

const optionsSchema = new Schema({
    option_description: String,
    option_id: Number,
    //count: Number
})

module.exports = mongoose.model('Option', optionsSchema);