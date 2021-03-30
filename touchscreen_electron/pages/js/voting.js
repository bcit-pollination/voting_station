// FIXME: DELETE THESE:
let importStep = document.getElementById("step-II-1");
importStep.style.visibility = "visible";

// let global_JSON = {}

const { getCurrentDateFormatted } = require("../../../utils/dateFormat");
const { login } = require("../../../utils/pollinationAPI");

const { startBLEServerProcess } = require("../../../utils/process");
const { checkPassword, decodeBase64 } = require("../../../utils/passwordHash");

const ElectionPackageModel = require("../../../utils/mongo/models/electionPackage");
const QuestionModel = require("../../../utils/mongo/models/question");

const axios = require("axios");

let rpi_location = "";
let voting_token_check = [];
let this_voting_token = "";
let questJSON = null;
let votes_cast = [];
let election_id = null;

// step-I: login
// let submit_password_button = document.getElementById('submit-verifier-password')
// submit_password_button.onclick = checkVerifierPassword

function votingLoginButtonHandler() {
    console.log('clicked: voting-login-button')
    let email = document.getElementById('login-username-input').value
    let password = document.getElementById('login-password-input').value
    console.log(email, password);

    // stores the jwt in the global variable
    login(email, password).then((jwt) => {
        session_jwt = jwt;
        console.log(jwt);
        let loginForm = document.getElementById('step-I');
        // loginForm.style.visibility = 'hidden';

        // Let the Verifier add the location. Submit button uses submitLocation.
        loginForm.innerHTML = "<center><h2>Please enter the location of<br>this polling station.</h2><br><br><input type='text' id='rpi-location-id' /><br><br><button onclick = 'submitLocation()'>Submit</button></center>";

        let verifierPasswordStep = document.getElementById('step-II-0')
        verifierPasswordStep.style.visibility = 'visible'

        // FIXME: uncomment this:
        // let importStep = document.getElementById('step-II-1');
        // importStep.style.visibility = 'visible';
    });
}

function checkVerifierPassword() {
    // let loginPromise = new Promise(async(resolve,reject)=>{
    //   resolve(password)
    // })
    let password = document.getElementById("verifier-password-input").value;
    // FIXME : remove the hardcoded
    // electionDownload(31).then((package) => {
    //   if (checkPassword(password, decodeBase64(package['verifier_password']))) {
    //     let importStep = document.getElementById('step-II-1');
    //     importStep.style.visibility = 'visible';
    //   }
    // })

    // ElectionPackageModel.
}


function submitLocation() {
    // Set rpi_location to the Location.
    let this_location = document.getElementById("rpi-location-id").value;
    rpi_location = this_location;
    console.log("The location has been set to: " + rpi_location);

    // Clear login page.
    promptVotingToken();
}


function promptVotingToken() {
    let loginForm = document.getElementById("step-I");
    loginForm.innerHTML = "";
    loginForm.innerHTML =
        "<center><h2>Please enter the voter's voting token.</h2><br><br><input type='text' id='voting-token-id' /><br><br><button onclick = 'submitVotingToken()'>Submit</button><br><br><button onclick = 'axiosPOST()'>End Election</button></center>";
}

function submitVotingToken() {
    this_voting_token = document.getElementById("voting-token-id").value;
    console.log("this_voting_token: " + this_voting_token);

    console.log("Checking voting token check:");
    console.log(voting_token_check);

    if (voting_token_check.includes(this_voting_token)) {
        loadPoll(questJSON);
    } else {
        promptVotingToken();
    }
}

function loadPoll(questJSON) {
    let loginForm = document.getElementById('step-I');
    loginForm.innerHTML = "";

    let questArray = questJSON.election_info.questions;
    let questIdArray = [];

    for (let item of questJSON.voter_list) {
        console.log(item);
        console.log(item.voting_token);
        voting_token_check = voting_token_check.concat(item.voting_token);
    }

    console.log(voting_token_check);

    // let questArray = questJSON.election_info.questions;

    for (let i = 0; i < questArray.length; i++) {
        let number = i + 1;
        let name = "q" + number;
        let questOps = questArray[i].options;
        let questDiv = document.createElement("div");
        let title = document.createElement("h2");
        title.appendChild(document.createTextNode("Question " + number));
        questDiv.appendChild(title);
        questDiv.appendChild(document.createTextNode(questArray[i].question_description));
        for (let j = 0; j < questOps.length; j++) {
            let number2 = j + 1;
            let inpt = document.createElement("input");
            let label = document.createElement("label");
            questDiv.appendChild(document.createElement("br"));
            label.style.fontSize = "1em";
            label.appendChild(document.createTextNode(questOps[j].option_description));
            questDiv.appendChild(label);
            if (questJSON.max_selection_count == 1 && questJSON.min_selection_count == 1) {
                inpt.type = "radio";
            } else {
                inpt.type = "checkbox";
            }
            inpt.name = name;
            inpt.id = name + number2;
            inpt.value = questOps[j].option_id;
            inpt.style.height = "2vw";
            inpt.style.width = "2vh";
            questDiv.appendChild(inpt);
            questDiv.appendChild(document.createElement("br"));
        }
            document.getElementById("step-IV").appendChild(questDiv);
            console.log(questArray[i]);
    }

    let submitButton = document.createElement("button");
    submitButton.style.width = "10%";
    submitButton.style.height = "10%";
    submitButton.appendChild(document.createTextNode("Submit Votes"));

    // Submit the Vote.
    // TODO: Add the fields for FirstName, LastName, questions.
    submitButton.onclick = function() {
        let votingSelection = [];
        // looping through
        for (let j = 0; j < questArray.length; j++) {
            let num = j + 1;
            let values = document.getElementsByName("q" + num);
            let checkVal = null;
            for (let k = 0; k < values.length; k++) {
                if (values[k].checked) {
                    checkVal = values[k].value;
                }
            }

            // FIXME: Change this for line 431 as well
            let choiceObject = {
                option_id: parseInt(checkVal),
                // FIXME:  Leaving as 0 for now.
                order_position: 0,
                question_id: questIdArray[j],
            };
            votingSelection.push(choiceObject);
        }
        console.log(votingSelection);

        // TODO: Finish building this vote once Karel finalizes vote schema.
        let vote = {
            choices: votingSelection,
            location: rpi_location,
            time_stamp: getCurrentDateFormatted(),
            // FIXME: Add fields for names.
            voter_first_name: "MARK",
            voter_last_name: "KIM",
            voting_token: this_voting_token,
        };
        console.log(vote);

        // FIXME: SAVE VOTES INTO DB USING Mongoose
        let axiosResult = axios.post("http://localhost:3000/postVotes", vote);

        // votes_cast.push(vote);
        // console.log(votes_cast);

        let vote_div = document.getElementById("step-IV");
        vote_div.appendChild(submitButton);
        vote_div.style.visibility = "hidden";
        promptVotingToken();
    };
    // appending the submit button , make it visible
    let vote_div = document.getElementById("step-IV");
    vote_div.appendChild(submitButton);
    vote_div.style.visibility = "visible";

    document.getElementById("voting-token-button").addEventListener("click", () => {
        console.log('clicked "voting-token-input"');

        let updateQuestionApi;
        let xhttp = new XMLHttpRequest();

        let response = "";

        console.log("q_list");
        console.log(q_list);
        xhttp.open("POST", updateQuestionApi, true);
        xhttp.setRequestHeader("Content-type", "application/json");

        let post_obj = { allowVote: true };
        console.log(JSON.stringify(post_obj));
        xhttp.send(JSON.stringify(post_obj));
    });

    // Start BLE server:
    document.getElementById("start-BLE-button").addEventListener("click", () => {
        console.log("clicked: start-BLE-button");
        startBLEServerProcess();
    });

    showExportSection();
}

function showExportSection() {
    const exportSection = document.getElementById("step-V");
    exportSection.style.visibility = "visible";
}

function exportData() {
    const checkedRadio = document.querySelector('input[name="usb"]:checked');
    if (!checkedRadio) return;

    const path = checkedRadio.value;

    const url = new URL("http://localhost:3000/dataExport");
    const params = { pathName: path };

    url.search = new URLSearchParams(params).toString();
    fetch(url)
        .then((response) => response.json())
        .then((body) => {
            console.log(body);
        });
}

function importData() {

    const checkedRadio = document.querySelector('input[name="usb"]:checked');
    if (!checkedRadio) return;

    const path = checkedRadio.value;


    const url = new URL("http://localhost:3000/dataImport");
    const params = { pathName: path };

    // fetch the imported data from the usb
    url.search = new URLSearchParams(params).toString();
    fetch(url).then(response => response.json())
        .then((body) => {
            console.log(body);

            // After loading, hide the buttons that does the input. 
            let importStep = document.getElementById('step-II-1');
            importStep.style.visibility = 'hidden';


            let questJSON = JSON.parse(body);
            console.log('questJSON');
            console.log(questJSON);

            save_election_package_and_questions(questJSON)
            loadPoll(questJSON)
                // loadPoll(questJSON)

            // // saving electionPackage to mongo
            // const electionPackage = new ElectionPackage(body);
            // electionPackage.save(() => {
            //   console.log('saving')
            //   err && console.log(err);
            //   console.log(doc)
            //   document.getElementById("start-BLE-button").style.visibility = "visible";
            // })
            // document.getElementById("start-BLE-button").style.visibility = "visible"; //FIXME : Remove this line

        });
}


function save_election_package_and_questions(questJSON) {

    const electionPackage = new ElectionPackageModel(questJSON);

    ElectionPackageModel.remove({}, (err, res) => {
        electionPackage.save((err, doc) => {
            console.log('saving')
            err && console.log(err);
            console.log(doc)
            document.getElementById("start-BLE-button").style.visibility = "visible";
        })

        for (let question of electionPackage.election_info.questions) {
            const question_obj_to_save = new Question(question)
            question_obj_to_save.save((err, doc) => {
                console.log('saving')
                err && console.log(err);
                console.log(doc)
            })
        }
    })
}

function showUsbs() {
    fetch('http://localhost:3000/usbs')
        .then(response => response.json())
        .then(data => {
            data = JSON.parse(data);
            console.log(data);
            let usbsDiv = document.getElementById("usbs");
            usbsDiv.innerHTML = "";
            for (const usb of data.usbs) {
                if (usb.path == "/" || usb.path == "/boot/efi") continue; // HACK should not show these
                let div = document.createElement("div");
                let input = document.createElement("input");
                let label = document.createElement("label");
                input.setAttribute("type", "radio");
                input.setAttribute("id", usb.path);
                input.setAttribute("name", "usb");
                input.setAttribute("value", usb.path);
                input.setAttribute("class", "radio");
                input.checked = false;
                label.innerText = usb.path;
                div.appendChild(input);
                div.appendChild(label);
                usbsDiv.appendChild(div);
            }

        })
}

function goBack() {
    window.history.back();
}

// // Testing because no RPI during development.
// function importDataTest() {
//   let importStep = document.getElementById('step-II-1');
//   importStep.style.visibility = 'hidden';

//   // Test election for when I'm not developing on RPI.
//   let test_election = {
//     "election_info": {
//       "anonymous": true,
//       "election_description": "ELECTION FOR THE PRESIDENTE.",
//       "election_id": 14,
//       "end_time": "2021-03-27T06:00:00+00:00",
//       "org_id": 16,
//       "public_results": false,
//       "questions": [
//         {
//           "election_id": 14,
//           "max_selection_count": 1,
//           "min_selection_count": 1,
//           "options": [
//             {
//               "option_description": "Polar bear",
//               "option_id": 31
//             },
//             {
//               "option_description": "Grizzly bear",
//               "option_id": 32
//             },
//             {
//               "option_description": "Black bear",
//               "option_id": 33
//             }
//           ],
//           "ordered_choices": true,
//           "question_description": "What bear is best?",
//           "question_id": 16
//         },
//         {
//           "election_id": 14,
//           "max_selection_count": 1,
//           "min_selection_count": 1,
//           "options": [
//             {
//               "option_description": "Fine",
//               "option_id": 34
//             },
//             {
//               "option_description": "Well thank you",
//               "option_id": 35
//             },
//             {
//               "option_description": "Swell!",
//               "option_id": 36
//             }
//           ],
//           "ordered_choices": true,
//           "question_description": "How are you?",
//           "question_id": 17
//         }
//       ],
//       "start_time": "2021-03-27T05:00:00+00:00",
//       "verified": true
//     },
//     "verifier_password": "batsandcats",
//     "voter_list": [
//       {
//         "user_org_id": "4444",
//         "voting_token": [
//           "fake_token5.545866420051571e+18"
//         ]
//       },
//       {
//         "user_org_id": "4444",
//         "voting_token": [
//           "token2",
//           "token3",
//         ]
//       }
//     ]
//   }
//   questJSON = test_election;

//   render_questions(questJSON)

//   // Imports the array of valid Voting Tokens.
//   for (let item of questJSON.voter_list) {
//     console.log(item);
//     console.log(item.voting_token);
//     voting_token_check = voting_token_check.concat(item.voting_token);
//   }
//   console.log(voting_token_check);

//   election_id = questJSON.election_info.election_id;

//   const electionPackage = new ElectionPackageModel(test_election);

//   ElectionPackageModel.remove({}, (err, res) => {
//     electionPackage.save((err, doc) => {
//       console.log('saving')
//       err && console.log(err);
//       console.log(doc)
//       // document.getElementById("start-BLE-button").style.visibility = "visible";
//     })

//     for (let question of electionPackage.election_info.questions) {
//       const question_obj_to_save = new Question(question)
//       question_obj_to_save.save((err, doc) => {
//         console.log('saving')
//         err && console.log(err);
//         console.log(doc)
//       })
//     }
//   })

//   console.log('document.getElementById("start-BLE-button")')
//   console.log(document.getElementById("start-BLE-button"))
//   document.getElementById("start-BLE-button").style.visibility = "visible";

//   function render_questions(questJSON) {
//     for (let item of questJSON.voter_list) {
//       console.log(item);
//       console.log(item.voting_token);
//       voting_token_check = voting_token_check.concat(item.voting_token);
//     }

//     console.log(voting_token_check);

//     let questArray = questJSON.election_info.questions;

//     for (let i = 0; i < questArray.length; i++) {
//       let number = i + 1;
//       let name = "q" + number;
//       let questOps = questArray[i].options;
//       let questDiv = document.createElement("div");
//       let title = document.createElement("h2");
//       title.appendChild(document.createTextNode("Question " + number));
//       questDiv.appendChild(title);
//       questDiv.appendChild(document.createTextNode(questArray[i].question_description));
//       for (let j = 0; j < questOps.length; j++) {
//         let number2 = j + 1;
//         let inpt = document.createElement("input");
//         let label = document.createElement("label");
//         questDiv.appendChild(document.createElement("br"));
//         label.style.fontSize = "1em";
//         label.appendChild(document.createTextNode(questOps[j].option_description));
//         questDiv.appendChild(label);
//         inpt.type = "radio";
//         inpt.name = name;
//         inpt.id = name + number2;
//         inpt.value = questOps[j].option_id;
//         inpt.style.height = "2vw";
//         inpt.style.width = "2vh";
//         questDiv.appendChild(inpt);
//         questDiv.appendChild(document.createElement("br"));
//       }

//       document.getElementById("stepIV").appendChild(questDiv);
//       console.log(questArray[i]);
//     }
//     let votingSelection = [];
//     let submitButton = document.createElement("button");
//     submitButton.style.width = "10%";
//     submitButton.style.height = "10%";
//     submitButton.appendChild(document.createTextNode("Submit Votes"));

//     // Submit the Vote.
//     // TODO: Add the fields for FirstName, LastName, questions.
//     submitButton.onclick = function () {
//       votingSelection = [];
//       for (let j = 0; j < questArray.length; j++) {
//         let num = j + 1;
//         let values = document.getElementsByName("q" + num);
//         let checkVal = null;
//         for (let k = 0; k < values.length; k++) {
//           if (values[k].checked) {
//             checkVal = values[k].value;
//           }
//         }
//         votingSelection.push(checkVal);
//       }
//       console.log(votingSelection);

//       let vote = {
//         voting_token: this_voting_token,
//         loation: rpi_location,
//         time_stamp: getCurrentDateFormatted(),
//         // FIXME: Add fields for names.
//         voter_first_name: "MARK",
//         voter_last_name: "KIM",
//         question_num: "5",
//         choices: []
//       }
//     }
//     document.getElementById("stepIV").appendChild(submitButton);
//   }
// }