console.log('in express admin server')
const controller = require('../utils/export_tool/export_controller');


const {
  ElectionPackage,
} = require ('../utils/load-questions.js')

const express = require('express')
const app = express()
const port = 4000


app.get('/dataImport', function(req, res) {
  
    const pathname = req.query.pathName + "/";
    console.log(pathname );
    //TODO: Decide if key file should be env variable
    controller.runImport("./testing.key", pathname).then((data) => {
        console.log(data);
        res.json(data);
        // TODO: Store data in proper table
    }).catch((e) => console.log(e));

});

app.get('/dataExport', function(req, res) {
    //TODO Select the right data to send
    let jsonToExport = {}
     ElectionPackage.find({}, (err, allElections) => {

      console.log('allElections');
      console.log(allElections);
      if (err) console.error(err);
      jsonToExport = allElections[0]

      jsonToExport = JSON.stringify(jsonToExport);
      const pathname = req.query.pathName + "/";
      console.log(pathname );
      controller.runExport(jsonToExport, "./testing.key", pathname).then((data) => {
          console.log(data);
          res.json(data);
      }).catch((e) => console.log(e));
  })
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

app.get('/usbs', function(req, res) {
    controller.runUsbFetcher().then((data) => {
        console.log(data);
        res.json(data);
    }).catch((e) => console.log(e));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })

console.log('Server running at http://127.0.0.1:4000/');