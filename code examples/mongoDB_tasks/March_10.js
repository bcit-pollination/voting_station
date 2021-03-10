const mongoose = require('mongoose');
// const api = require('../../BLE_pollination/utils/pollination-api');

let conn = mongoose.connect('mongodb://127.0.0.1/pollination');//connect to the db

// define 'Schema' as the 'mongoose.Schema'
const Schema = mongoose.Schema;


const OptionsSchema = new Schema({
    option_description: String,
    option_id: Number,
    //count: Number
})


const QuestionSchema = new Schema({
    election_id: Number,
    question_id: Number,
    question_description: String,
    'options': [OptionsSchema],
    ordered_choices: Boolean,
    max_selection_count: Number,  //How many of the given question options can the user select. Must be >= 1
    min_selection_count: Number,  //minimum: 1
    // Things to add ...
}, {collection : 'questions'});

const Question = mongoose.model('Question', QuestionSchema);

const Option = mongoose.model('Question', OptionsSchema);

let vote_package = {
    "election_info": {
      "anonymous": false,
      "election_description": "Official Test Election for 10.03.21",
      "election_id": 16,
      "end_time": "2021-03-12T08:30:00+00:00",
      "org_id": 15,
      "public_results": true,
      "questions": [
        {
          "election_id": 16,
          "max_selection_count": 1,
          "min_selection_count": 1,
          "options": {
            "option_description": "Tasks",
            "option_id": 43
          },
          "ordered_choices": true,
          "question_description": "What shall we vote on next?",
          "question_id": 19
        }
      ],
      "start_time": "2021-03-08T08:00:00+00:00",
      "verified": false
    },
    "verifier_password": "oiwefjoiwejfoiwe",
    "voter_list": [
      {
        "user_org_id": "A0001111",
        "voting_token": [
          "fake_token5.545866420051571e+18"
        ]
      }
    ]
  }

async function saveQuestionArrayAsDocs(question_array){
    console.log('saveAllQuestionsAsDocs')
    console.log(question_array)
    for(let item of question_array){
        let question_item = new Question(item)
        let option_arr = []
        // for(let itm of item.options){
        //   let option = new Option(itm)
        //   option_arr.push(option)
        // }
        
        question_item.options = option_arr;
        question_item.save((err, doc) => {
            console.log('saving')
            err && console.log(err);
            console.log(doc)           
        })
    }

}

// console.log(vote_package)

console.log(vote_package.election_info.questions)

saveQuestionArrayAsDocs(vote_package.election_info.questions)