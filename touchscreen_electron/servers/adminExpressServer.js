const controller = require("../../utils/export_tool/export_controller");
const ElectionPackageModel = require("../../utils/mongo/models/electionPackage");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pollination", { useNewUrlParser: true });
const VotesCastModel = require('../../utils/mongo/models/votesCast')
const {electionUpload,login} = require('../../utils/pollinationAPI')
const express = require("express");
const app = express();
const port = 4000;


app.get("/dataImport", function(req, res) {
    
    const pathname = req.query.pathName + "/";
    console.log(pathname);
    //TODO: Decide if key file should be env variable
    controller
        .runImport("./testing.key", pathname)
        .then((data) => {
            let vote_cast_to_save = JSON.parse(data)
            vote_cast_to_save = new VotesCastModel(vote_cast_to_save)

            vote_cast_to_save.save({},(err,doc)=>{
                 err && console.log(err)
                 console.log(doc)
            })

            console.log(data);
            res.json(data);
            // TODO: Store data in proper table
        })
        .catch((e) => console.log(e));
});

app.get("/dataExport", function(req, res) {
    //TODO Select the right data to send
    let jsonToExport = {};
    console.log('dataExport')
    // Verify new election package was saved
    console.log(mongoose.connection.readyState)
    ElectionPackageModel.find({}, (err, allElections) => {
        console.log("allElections");
        console.log(allElections);
        if (err) console.error(err);
        jsonToExport = allElections[0];

        jsonToExport = JSON.stringify(jsonToExport);
        console.log(jsonToExport);
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
    // {
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


app.get("/uploadElectionResults", function(req, res) {
    console.log('uploadElectionResults')
    VotesCastModel.find({},(err,votes_casts)=>{

        err && console.log(err)
        console.log(votes_casts)
        let submission_obj = {}

        submission_obj.election_id = votes_casts[0].election_id

        all_votes_casts = []
        for(let each of votes_casts){
            all_votes_casts = all_votes_casts.concat(each.votes_cast)
        }
        
    
        submission_obj.votes_cast = all_votes_casts

        console.log('submission_obj')
        console.log(submission_obj)
        res.json(submission_obj)

    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

console.log("Server running at http://127.0.0.1:4000/");