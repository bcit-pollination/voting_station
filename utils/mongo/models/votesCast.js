const mongoose = require('mongoose');
const VoteModel = require('./vote')
const { Schema } = mongoose;

const VotesCastSchema = new Schema({
    election_id : Number,
    votes_cast : [VoteModel.schema]
})

module.exports = mongoose.model('VotesCast', VotesCastSchema);