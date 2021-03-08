// import Mongoose module
// const bson = require('./node_modules/bson/browser_build/bson');
const mongoose = require('mongoose');

// define 'Schema' as the 'mongoose.Schema'
var Schema = mongoose.Schema;



var OptionsSchema = new Schema({
    description: String,
    option_num: Number,
    count: Number
})

var QuestionSchema = new Schema({
    question_num: Number,
    description: String,
    selection_limit: Number,
    opts: [OptionsSchema],
    // Things to add ...
},{collection:'questions'});

// Let mongoose know that Question is a schema using QuestionSchema
var Question = mongoose.model('Question', QuestionSchema,{collection:'questions'});

var multi_question_test = new Question({
    question_num: 1,
    description: "Quel est votre plat préféré ?",
    selection_limit: 1,
    opts: [
        {
            option_num: 1,
            description: "Sandwich",
            count: 0,
        },
        {
            option_num: 2,
            description: "Pizza",
            count: 0,
        },
        {
            option_num: 3,
            description: "SuShi",
            count: 0,
        }
    ]
})
// console.log(multi_question_test)

multi_question_test.save((err,doc)=>{
    console.log('saving')
    err && console.log(err);
    console.log(doc)
    return
})

module.exports = {
    Question,
}