// import mongoose
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000

const MongoClient = require('mongodb').MongoClient
const mongoHost = '127.0.0.1';
const userName = ''
const userPassword = ''
const mongoPort = 27017
const dbName = 'pollination'
const collectionName = 'questions'


// import schema
// const { Question } = require('./models/question_schema')

// default mongoose conn:
const mongoDB = 'mongodb://127.0.0.1/pollination';
mongoose.connect(mongoDB);


mongoose.Promise = global.Promise;

// default connection
const db = mongoose.connection;


// app.get('/getQuestion/:id', function (req, res) {
//     let question_id = req.params.id;
//     (Question).findOne({question_num: question_id},(err,oneQuestion)=>{
//         if (err) console.error(err);
//         res.send(oneQuestion);
//     }) 
// });

// app.get('/getQuestions2', function (req, res) {
//     console.log('getQuestions')
//     db.collection('questions',(err,collection)=>{
//         collection.find({}).toArray(a=>{
//             console.log(a)
//         })
//     })

//     Question.findOne({},(err,questions)=>{
//         if (err) console.error(err);
//         console.log(questions)
//         res.send(questions);
//     }) 
// });

app.get('/getQuestions', function (req, res) {
    console.log('getQuestions')

    // fetch questions from DB
    // MongoClient.connect(`mongodb://${userName}:${userPassword}@${mongoHost}:${mongoPort}/`
    MongoClient.connect(`mongodb://${mongoHost}:${mongoPort}/`
        , function (err, db) {
            if (err) throw err;
            var dbo = db.db(`${dbName}`);
            dbo.collection(collectionName).find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                db.close();
                res.send(result)
            });
        });

});

app.post('/postVotes', function (req, res) {
    console.log('getQuestions')

    // fetch questions from DB
    // MongoClient.connect(`mongodb://${userName}:${userPassword}@${mongoHost}:${mongoPort}/`
    MongoClient.connect(`mongodb://${mongoHost}:${mongoPort}/`
        , function (err, db) {
            if (err) throw err;
            var dbo = db.db(`${dbName}`);
            dbo.collection(collectionName).find({}).toArray(function (err, result) {
                if (err) throw err;
                console.log(result);
                db.close();
                res.send(result)
            });
        });

});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))