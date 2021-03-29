const mongoose = require('mongoose');
const { Schema } = mongoose;

const voterSchema = new Schema({
    voting_token: String,
    location: String,
    time_stamp: Date,
    voter_first_name: String,
    voter_last_name: String,
    question_num: Number,
    choices: [{
        question_id: Number,
        option_id: Number,
        order_position: Number,
    }]
}, { collection: 'votes' })

module.exports = mongoose.model('Voter', voterSchema);