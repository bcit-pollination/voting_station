const mongoose = require('mongoose');
const OptionModel = require('./options');

const { Schema } = mongoose;

const questionSchema = new Schema({
    election_id: Number,
    question_id: Number,
    question_description: String,
    'options': [OptionModel.schema],
    ordered_choices: Boolean,
    max_selection_count: Number, // How many of the given question options can the user select. Must be >= 1
    min_selection_count: Number, // minimum: 1
    // Things to add ...
}, { collection: 'questions' });


module.exports = mongoose.model('Question', questionSchema);