// import Mongoose module
// const bson = require('./node_modules/bson/browser_build/bson');
const mongoose = require('mongoose');

var conn = mongoose.connect('mongodb://127.0.0.1/pollination');//connect to the db

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

// 
var OptionsSchema = new Schema({
    option_description: String,
    option_id: Number,
    //count: Number
})

var QuestionSchema = new Schema({
    election_id: Number,
    question_id: Number,
    question_description: String,
    'options': [OptionsSchema],
    ordered_choices: Boolean,
    max_selection_count: Number,  //How many of the given question options can the user select. Must be >= 1
    min_selection_count: Number,  //minimum: 1
    // Things to add ...
}, {collection : 'questions'});


// Vote Schema :
var VoteSchema = new Schema({
    voting_token: String,
    location : String,
    time_stamp: Date,
    voter_first_name : String,
    voter_last_name : String,
    question_num: Number,
    choices: [
        {
            question_id : Number,
            option_id: Number,
            order_position : Number,
        }
    ]


}, {collection : 'votes'})



//-------------------- Models ---------------------------//
// Let mongoose know that Question is a schema using QuestionSchema
var Question = mongoose.model('Question', QuestionSchema);


// what is a vote? I think the variable name can be more intuitive.
var Vote = mongoose.model('VoteSchema', VoteSchema);




//--------------- Iinstances------------------------//
var multi_question_test = new Question({
    question_id: 1,
    question_description: "Quel est votre plat préféré ?",
    min_selection_count: 1,
    max_selection_count: 1,
    ordered_choices: false,
    'options': [
        {
            option_id          : 1,
            option_description: "Sandwich",
        },
        {
            option_id: 2,
            option_description: "Pizza",
        },
        {
            option_id: 3,
            option_description   : "SuShi",
        }
    ]
})
// console.log(multi_question_test)

multi_question_test.save((err, doc) => {
    console.log('saving')
    err && console.log(err);
    console.log(doc)
    return
})


module.exports = {
    Question,
    Vote
}