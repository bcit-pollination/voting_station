const mongoose = require('mongoose');
var conn = mongoose.connect('mongodb://127.0.0.1/pollination'); //connect to the db

// define 'Schema' as the 'mongoose.Schema'
var Schema = mongoose.Schema;

// console.log(mongoose)
// Questions 
// [
//     "ObjectId",
//     "description",
//     "selection_limit",
//     "question_num",
//     "options": [
//         "description",
//         "option_num",
//         "count"
//     ]
// ]

// Options
const OptionsSchema = new Schema({
    option_description: String,
    option_id: Number,
    //count: Number
})

// Questions
const QuestionSchema = new Schema({
    election_id: Number,
    question_id: Number,
    question_description: String,
    'options': [OptionsSchema], //Array
    ordered_choices: Boolean,
    max_selection_count: Number, //How many of the given question options can the user select. Must be >= 1
    min_selection_count: Number, //minimum: 1
    // Things to add ...
}, { collection: 'questions' });


// Vote Schema :
// HACK: Changed data type
// for time_stamp from Date to String
const VoteSchema = new Schema({
    voting_token: String,
    location: String,
    time_stamp: String,
    voter_first_name: String,
    voter_last_name: String,
    question_num: Number,
    choices: [{
        question_id: Number,
        option_id: Number,
        order_position: Number,
    }]
}, { collection: 'votes' })

// Vote Schema :
const VoterSchema = new Schema({
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


// 
const ElectionPackageSchema = new Schema({
    // the two primary fields
    voter_list: [VoterSchema],
    verifier_password: String,
    // nested fields
    election_info: {
        election_id: Number, // used for getting the package
        org_id: String, // used for rendering
        anonymous: Boolean,

        public_results: String,

        election_description: String, // 
        // deals with time peroid
        start_time: String,
        end_time: String,
        // most important   
        questions: [QuestionSchema], // question objects
        verified: Boolean, // type of votes
    }
})


//-------------------- Models ---------------------------//
// Let mongoose know that Question is a schema using QuestionSchema
var Question = mongoose.model('Question', QuestionSchema);

var Vote = mongoose.model('VoteSchema', VoteSchema);

var Voter = mongoose.model('Voter', VoterSchema);

var ElectionPackage = mongoose.model('ElectionPackage', ElectionPackageSchema)


module.exports = {
    ElectionPackage,
    ElectionPackageSchema,
    OptionsSchema,
    Question,
    QuestionSchema,
    Schema,
    Vote,
    Voter,
    VoteSchema,
    VoterSchema,
}