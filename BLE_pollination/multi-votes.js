var util = require('util');
var bleno = require('bleno');
var pizza = require('./polling');
// questions got from mongo
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// const xhr = new XMLHttpRequest();

const {fetchQuestionViaAPI, checkVotabliy} =require('./fetch-questions')

let json_string = ''

fetchQuestionViaAPI().then((res)=>{
  json_string = res
  console.log(json_string)
})






var { stringToBytes } = require('convert-string')


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
    properties: ['notify', 'write', 'read'],
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

// Checks if the user is actually votable
let votable = false;


MultiVoteCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
  checkVotabliy().then(()=>{
    votable = true;
  })
  
  //char code
  console.log(typeof data)

  console.log(data)
  let decoded_data = String.fromCharCode.apply(null, data)
  console.log(decoded_data)

  //if it's the first time sending info
  if (data_length_to_process == 0) {
    console.log('getting data_length_to_process');
    data_length_to_process = parseInt(decoded_data.substr(0, decoded_data.indexOf(' ')));
    data_string = decoded_data.substr(decoded_data.indexOf(' ') + 1, decoded_data.length)
    data_length_processed = data_string.length
    console.log('data_length_to_process' + data_length_to_process)
    console.log('data_string' + data_string)
    console.log('data_length_processed' + data_length_processed)

  }
  else if (data_length_processed < data_length_to_process) {
    console.log('data_length_processed < data_length_to_process')
    console.log('data_length_processed' + data_length_processed)
    data_string += decoded_data
    data_length_processed += decoded_data.length;
    console.log('data_length_processed' + data_length_processed)

    if (data_length_processed >= data_length_to_process) {
      console.log('handleMultiVote')
      handleMultiVote(data_string)
      data_string = '';
      data_length_processed = 0;
      data_length_to_process = 0;
    }
  }
  else if (data_length_processed >= data_length_to_process) {
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
  // console.log('sliced: |' + vote_string.trim().slice(0, -4) + '|')

  let vote_data_json = JSON.parse(vote_string.trim())
  console.log('User Voted For : \n')
  
  let xhttp = new XMLHttpRequest();

  let response = ''

  xhttp.open("POST","http://localhost:3000/postVotes", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
 
  let post_obj = JSON.stringify({ 'obj': vote_data_json })
  console.log(post_obj)

  
  xhttp.send(post_obj)
  // xhttp.send(JSON.stringify(q_list));

  xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          response = this.responseText;
          // resolve(response)
      }
  }

  
}

// let data_string = ''
// let written = false
// let data_length_processed = 0
// let data_length_to_process = 0


let json_string_len = 0
let json_sent_len = 0
let json_buffer = ''
let length_sent = false



MultiVoteCharacteristic.prototype.onReadRequest = function (offset, callback) {

  

  console.log('on read request')
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    // var data = new Buffer(20);
    // data.writeUInt16BE('helloworld', 0);


    // Sends the length to send on the first readRequest.
    if (json_sent_len == 0 && length_sent == false) {



      json_string_len = json_string.length

      json_buffer = json_string_len + ''
      console.log(json_buffer)
      length_sent = true
      callback(this.RESULT_SUCCESS, stringToBytes(json_buffer));
    }
    // start sending the actual data:
    else if (json_string_len - 20 > 0) {
      console.log(json_string_len)
      json_string_len -=20
      console.log(json_string_len)
      // 

      json_buffer = json_string.slice(json_sent_len, json_sent_len + 20)
      console.log(json_buffer)
      json_sent_len += 20
      // callback(this.RESULT_SUCCESS, stringToBytes(json_buffer));
    }
    else {
      json_buffer = json_string.slice(json_sent_len, json_sent_len+json_string_len)
      json_sent_len += 20
      console.log(json_buffer)
      console.log('done!')

      // let json_string = ''
      
      // reset
      json_sent_len = 0
      length_sent = false
      json_string_len = json_string.length
      

    }



    // console.log(typeof data)
    callback(this.RESULT_SUCCESS, stringToBytes(json_buffer));
  }

};

module.exports = MultiVoteCharacteristic;