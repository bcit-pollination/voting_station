const mongoose = require('mongoose');

var conn = mongoose.connect('mongodb://127.0.0.1/pollination');//connect to the db

// define 'Schema' as the 'mongoose.Schema'
var Schema = mongoose.Schema;

const ElectionSchema = new Schema({
    election_info: {
        anonymous: Boolean,
        election_description: String,
        election_id: Number,
        end_time: String,
        org_id: Number,
        public_results: Boolean,
        questions: [{
            election_id: Number,
            max_selection_count: Number,
            min_selection_count: Number,
            options: [{
                option_description: String,
                option_id: Number
            }],
            ordered_choices: Boolean,
            question_description: String,
            question_id: Number
        }],
        start_time: String,
        verified: Boolean
    },
    verifier_password: String,
    voter_list: [String]

}, {collection : 'elections'});

const VoteResultsSchema = new Schema({
    question_results: [{
        options_posed: [{
            option_description: String,
            option_id: Number
        }]
    }],
    user_votes: [{
        choices: [{
            option_id: Number,
            order_position: Number,
            question_id: Number
        }],
        location: String,
        time_stamp: String,
        voter_first_name: String,
        voting_token: String
    }],
    election_info: {
        anonymous: Boolean,
        election_description: String,
        election_id: Number,
        end_time: String,
        org_id: Number,
        public_results: Boolean,
        questions: [{
            election_id: Number,
            max_selection_count: Number,
            min_selection_count: Number,
            options: [{
                option_description: String,
                option_id: Number
            }],
            ordered_choices: Boolean,
            question_description: String,
            question_id: Number
        }],
        start_time: String,
        verified: Boolean
    },
    org_info: {
        name: String,
        org_id: Number
    }
}, {collection : 'voting_results'});

var Election = mongoose.model('Election', ElectionSchema);

var VoteResults = mongoose.model('VoteResults', VoteResultsSchema);

var election_download_test = [{
    "election_info": {
      "anonymous": true,
      "election_description": "election_description",
      "election_id": 0,
      "end_time": "2021-01-30T08:30:00+07:30",
      "org_id": 6,
      "public_results": true,
      "questions": [
        {
          "election_id": 5,
          "max_selection_count": 1,
          "min_selection_count": 1,
          "options": [
            {
              "option_description": "option_description",
              "option_id": 7
            },
            {
              "option_description": "option_description",
              "option_id": 7
            }
          ],
          "ordered_choices": true,
          "question_description": "question_description",
          "question_id": 1
        },
        {
          "election_id": 5,
          "max_selection_count": 1,
          "min_selection_count": 1,
          "options": [
            {
              "option_description": "option_description",
              "option_id": 7
            },
            {
              "option_description": "option_description",
              "option_id": 7
            }
          ],
          "ordered_choices": true,
          "question_description": "question_description",
          "question_id": 1
        }
      ],
      "start_time": "2021-01-30T08:30:00+07:30",
      "verified": true
    },
    "verifier_password": "verifier_password",
    "voter_list": [
      "",
      ""
    ]
  }];

  function convertElectionPackage(pkg){
    for(let i = 0; i < pkg.length; i++){
        let election = new Election(pkg[i]);
        election.save((err, doc)=>{
            console.log('Saved');
            console.log(doc);
        });
    }
  }

  function convertVotingPackage(pkg){
    for(let i = 0; i < pkg.length; i++){
        let election = new VoteResults(pkg[i]);
        election.save((err, doc)=>{
            console.log('Saved');
            console.log(doc);
        });
    }
  }

  //convertElectionPackage(election_download_test);