var util = require('util');
var bleno = require('bleno');
var pizza = require('bleno/examples/pollination/polling');

var {stringToBytes} = require('convert-string')


var MongoClient = require('mongodb').MongoClient

//
//  config
//

var mongoPort = '27017'
var mongoHost = 'localhost'

var dbName = 'voting_station'
var userName = 'poll_admin'
var userPassword = 'pollination'


//  increment thhe   total votes
var collectionName = 'votes'


// holds the questions themselves
var collectionName2 = 'questions'




function MultiVoteCharacteristic(pizza) {
  bleno.Characteristic.call(this, {
    uuid: '13333333333333333333333333330009',
    properties: ['notify', 'write','read'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Bakes the pizza and notifies when done baking.'
      })
    ]
  });

  this.pizza = pizza;
}

util.inherits(MultiVoteCharacteristic, bleno.Characteristic);

console.log('--------------- data ------------------')

let data_string = ''
let written = false
let data_length_processed = 0
let data_length_to_process = 0

MultiVoteCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
  //char code
  console.log(typeof data)

  console.log(data)
  let decoded_data = String.fromCharCode.apply(null, data)
  console.log(decoded_data)

  //if it's the first time sending info
  if(data_length_to_process==0){
    console.log('getting data_length_to_process');
    data_length_to_process = parseInt(decoded_data.substr(0,decoded_data.indexOf(' '))); 
    data_string = decoded_data.substr(decoded_data.indexOf(' ') + 1 ,decoded_data.length)
    data_length_processed = data_string.length
    console.log('data_length_to_process' + data_length_to_process)
    console.log('data_string' + data_string)
    console.log('data_length_processed' + data_length_processed)
    
  }
  else if(data_length_processed < data_length_to_process){
    console.log('data_length_processed < data_length_to_process')
    console.log('data_length_processed' + data_length_processed)
    data_string += decoded_data
    data_length_processed += decoded_data.length;
    console.log('data_length_processed' + data_length_processed)

    if(data_length_processed >= data_length_to_process){
      console.log('handleMultiVote')
      handleMultiVote(data_string)
      data_string = '';
      data_length_processed = 0;
      data_length_to_process = 0;
    }
  }
  else if(data_length_processed >= data_length_to_process){
    console.log('handleMultiVote')
    handleMultiVote(data_string)
    data_string = '';
    data_length_processed = 0;
    data_length_to_process = 0;
  }


  

  

  // if (data_string.includes('END')) {

  // }

  callback(this.RESULT_SUCCESS);

};

function handleMultiVote(vote_string) {

  console.log(vote_string)
  ////deals with that of 'END', but not it's deprecated.
  // let vote_string_sliced = vote_string.trim().slice(0, -4)
  
 
  console.log('vote_string_trimmed: |' + vote_string.trim() + '|')
  console.log('sliced: |' + vote_string.trim().slice(0, -4) + '|')

  let vote_data_json = JSON.parse(vote_string.trim())
  console.log('vote_data_json.choice1')
  console.log(vote_data_json.choice1)
  console.log('vote_data_json.choice2')
  console.log(vote_data_json.item2)

  MongoClient.connect(`mongodb://${userName}:${userPassword}@${mongoHost}:${mongoPort}`, function (err, db) {
    if (err) throw err;

    var dbo = db.db(`${dbName}`);
    dbo.collection(`${collectionName}`).updateOne(

      //question id
      { "id": 1 },
      // increments the choice by 1.
      
      { $inc: { "chosen": 1 }, },
      { upsert: true }
    );

  })
}

// let data_string = ''
// let written = false
// let data_length_processed = 0
// let data_length_to_process = 0

MultiVoteCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('on read request')
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    // var data = new Buffer(20);
    // data.writeUInt16BE('helloworld', 0);

    data = 'helloworld'
    // data  = Array.from(data)
    // console.log(data)
    // console.log(typeof data)
    callback(this.RESULT_SUCCESS, stringToBytes(data));
  }
};


// This should take in a parameter()
function getMultiVoteQuestions(voting_token) {

  
  MongoClient.connect(`mongodb://${userName}:${userPassword}@${mongoHost}:${mongoPort}`, function (err, db) {
    if (err) throw err;

    var dbo = db.db(`${dbName}`);
    dbo.collection(`${collectionName}`).findOne(

      //question id
      { "id": 1 },
      // increments the choice by 1.
      
      { $inc: { "chosen": 1 }, },
      { upsert: true }
    );

  })
}

  module.exports = MultiVoteCharacteristic;