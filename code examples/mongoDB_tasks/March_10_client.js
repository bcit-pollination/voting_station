var MongoClient = require('mongodb').MongoClient

//
//  config
//

var mongoPort = '27017'
var mongoHost = 'localhost'

var dbName = 'voting_station'
var userName = 'poll_admin'
var userPassword = 'pollination'

var collectionName = 'votes'


// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://127.0.0.1/";
const client = new MongoClient(uri);


const doc = {
  "election_id": 16,
  "max_selection_count": 1,
  "min_selection_count": 1,
  "options": [{
    "option_description": "Tasks",
    "option_id": 43
  }],
  "ordered_choices": true,
  "question_description": "What shall we vote on next?",
  "question_id": 19
}



// Creating new collections in the db
MongoClient.connect(`mongodb://127.0.0.1`, function (err, db) {
  if (err) throw err;
  var dbo = db.db("pollination");
  dbo.collection('questions').insertOne(doc, function (error, response) {
    if (error) {
      console.log('Error occurred while inserting');
      // return 
    } else {
      console.log('inserted record', response.ops[0]);
      // return 
    }
  });
});