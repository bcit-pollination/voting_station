// import mongoose
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3000;
const controller = require("../../utils/export_tool/export_controller");
const MongoClient = require("mongodb").MongoClient;
const mongoHost = "127.0.0.1";
const userName = "";
const userPassword = "";
const mongoPort = 27017;
const dbName = "pollination";
const collectionName = "questions";
const bodyParser = require("body-parser");

// define 'Schema' as the 'mongoose.Schema'
const Schema = mongoose.Schema;

// let votable = false
let votable = true;

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// import schema
// const { Question } = require('./models/question_schema')

// default mongoose conn:
const mongoDB = "mongodb://127.0.0.1/pollination";
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

// default connection
const db = mongoose.connection;

// Vote Schema :
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
    }, ],
}, { collection: "votes" });

// one vote obj
const Vote = mongoose.model("Vote", VoteSchema);

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

async function addVote(voteVal) {
    let vote_to_add = new Vote(voteVal);
    vote_to_add.save((err, doc) => {
        console.log("saving vote_to_add");
        err && console.log(err);
        console.log(doc);
        return;
    });
}

async function verifyVotingToken(query_target) {
    let collection_name = "voting_users";

    return new Promise(async(resolve, reject) => {
        await MongoClient.connect(
            `mongodb://${mongoHost}:${mongoPort}/`,
            function(err, db) {
                if (err) throw err;
                var dbo = db.db(`${dbName}`);
                dbo
                    .collection(collection_name)
                    .find({
                        voting_token: query_target,
                    })
                    .toArray(function(err, result) {
                        if (err) throw err;

                        console.log("result=======");
                        console.log(result);
                        console.log("result=======");

                        //FIXME: if it is not a user, the vote must not proceed.
                        if (result.length != 0) {
                            console.log(result);
                            console.log("votable!!!");
                            votable = true;
                        } else {
                            console.log(result);
                            console.log("not votable!!!");
                            votable = false;
                        }

                        db.close();
                        resolve(votable);
                    });
            }
        );
    });
}

app.get("/getQuestions", function(req, res) {
    console.log("getQuestions");

    // fetch questions from DB
    // MongoClient.connect(`mongodb://${userName}:${userPassword}@${mongoHost}:${mongoPort}/`
    MongoClient.connect(
        `mongodb://${mongoHost}:${mongoPort}/`,
        function(err, db) {
            if (err) throw err;
            var dbo = db.db(`${dbName}`);
            dbo
                .collection(collectionName)
                .find({})
                .toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    db.close();
                    res.send(result);
                });
        }
    );
});

app.get("/dataImport", function(req, res) {
    const pathname = req.query.pathName + "/";
    console.log(pathname);
    //TODO: Decide if key file should be env variable
    controller
        .runImport("./testing.key", pathname)
        .then((data) => {
            console.log(data);
            res.json(data);
            // TODO: Store data in proper table
        })
        .catch((e) => console.log(e));
});

app.get("/dataExport", function(req, res) {
    //TODO Test if this is correct
    Vote.find({}, (err, jsonToExport) => {
        console.log(jsonToExport);
        //
        jsonToExport = JSON.stringify(jsonToExport);
        const pathname = req.query.pathName + "/";
        console.log(pathname);
        controller
            .runExport(jsonToExport, "./testing.key", pathname)
            .then((data) => {
                console.log(data);
                res.json(data);
            })
            .catch((e) => console.log(e));
    });
    // let jsonToExport = {
    //     "election_info": "",
    //     "org_info": {
    //       "name": "name",
    //       "org_id": 0
    //     },
    //     "user_votes": [
    //       {
    //         "choices": [
    //           {
    //             "option_id": 1,
    //             "order_position": 0,
    //             "question_id": 6
    //           },
    //           {
    //             "option_id": 1,
    //             "order_position": 0,
    //             "question_id": 6
    //           }
    //         ],
    //         "location": "location",
    //         "time_stamp": "2021-01-30T08:30:00+07:30",
    //         "voter_first_name": "voter_first_name",
    //         "voter_last_name": "voter_last_name",
    //         "voting_token": "voting_token"
    //       },
    //       {
    //         "choices": [
    //           {
    //             "option_id": 1,
    //             "order_position": 0,
    //             "question_id": 6
    //           },
    //           {
    //             "option_id": 1,
    //             "order_position": 0,
    //             "question_id": 6
    //           }
    //         ],
    //         "location": "location",
    //         "time_stamp": "2021-01-30T08:30:00+07:30",
    //         "voter_first_name": "voter_first_name",
    //         "voter_last_name": "voter_last_name",
    //         "voting_token": "voting_token"
    //       }
    //     ]
    //   }
});

app.get("/usbs", function(req, res) {
    controller
        .runUsbFetcher()
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((e) => console.log(e));
});

app.post("/postVotes", async function(req, res) {
    console.log("postVotes");

    console.log("votable??????");
    let p = verifyVotingToken();

    p.then((votable) => {
        console.log(votable);

        if (votable) {
            let vote = req.body.obj;
            console.log(req.body.obj);

            //Placed vote adding in an async function at the top.
            addVote(vote);
        } else {
            res.send("You Are Not Allowed To Vote!");
        }
    });
});

app.post("/allowVote", function(req, res) {
    console.log("allow vote?");

    let query_target = req.body.voting_token;
    votable = verifyVotingToken(query_target);
    // votable = true
    console.log(votable);
});

app.post("/disableVote", function(req, res) {
    console.log("allow vote?");

    votable = false;
    console.log(votable);
    // votable = true
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));