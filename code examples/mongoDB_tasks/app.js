const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'voting_system';

//Testing Data to use in the Database
const mainData = {
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
  };

  const mainData2 = {
    "question_results": [
      {
        "options_posed": [
          {
            "option_description": "option_description",
            "option_id": 7
          }
        ]
      }
    ],
    "user_votes": [
      {
        "choices": [
          {
            "option_id": 0,
            "order_position": 0,
            "question_id": 0
          }
        ],
        "location": "string",
        "time_stamp": "2021-01-30T08:30:00+07:30",
        "voter_first_name": "string",
        "voter_last_name": "string",
        "voting_token": "string"
      }
    ],
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
    "org_info": {
      "name": "name",
      "org_id": 6
    }
  };

function inputElectionData(item, database){
    database.collection('elections').insertOne(item);
}

function exportElectionData(database, id){
    
    database.collection('elections').find().next().then(product => {
        if(product['election_info']['election_id'] == id){
            return product;
        }
    });
}

function inputVotingRes(item, database){
    database.collection('votes').insertOne(item);
}

function exportVotingData(database, id){

    var arr = [];
    
    database.collection('votes').find().next().then(product => {
        if(product['election_info']['election_id'] == id){
            arr.push(product);
        }
    });
    return arr;
}


// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  //console.log(exportElectionData(db, 0));

  //console.log(exportVotingData(db, 0));

  //inputElectionData(mainData, db);

  //inputVotingRes(mainData2, db);

  client.close();
});

module.exports = {
    "getElectionData" : inputElectionData,
    "getVotingData" : inputVotingRes
};