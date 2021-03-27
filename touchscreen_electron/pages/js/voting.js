console.log('voting.js')
const export_controller = require('../utils/export_tool/export_controller.js');

const {get_current_date_formatted} = require('../utils/dateProcess.js');

// const ipc = import('electron').ipcRenderer;
const ipc = require('electron').ipcRenderer;
const mongoose = require('mongoose');
const {
    login,
    getElectionsList,
    electionDownload,
} = require('../utils/pollination-api.js');
const {
    ElectionPackage,
} = require ('../utils/load-questions.js')

const {
    // start_load_question_process,
    start_BLE_server_process,
    // voting_express_server_process,
} = require('../utils/voting_pi')  

let rpi_location = "";
let voting_token_check = [];
let this_voting_token = "";

// go Back
document.getElementById('go-back').addEventListener('click', () => {
    console.log('clicked: go-back');
    ipc.send("go-back", "cat");
});

// step-I: login
document.getElementById('voting-login-button').addEventListener('click', () => {
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

        let importStep = document.getElementById('step-II-1');
        importStep.style.visibility = 'visible';
    });

    // TODO: Set appropriate buttons visible, once we figure out functionality of this step.
})

function submitLocation() {
    // Set rpi_location to the Location.
    let this_location = document.getElementById('rpi-location-id').value;
    rpi_location = this_location;
    console.log("The location has been set to: " + rpi_location);

    // Clear login page.
    promptVotingToken();
}

function promptVotingToken() {
    let loginForm = document.getElementById('step-I');
    loginForm.innerHTML = "";
    loginForm.innerHTML = "<center><h2>Please enter the voter's voting token.</h2><br><br><input type='text' id='voting-token-id' /><br><br><button onclick = 'submitVotingToken()'>Submit</button></center>";
}

function submitVotingToken() {
    this_voting_token = document.getElementById('voting-token-id').value;
    console.log('this_voting_token: ' + this_voting_token);

    console.log("Checking voting token check:")
    console.log(voting_token_check);

    if (voting_token_check.includes(this_voting_token)) {
        console.log("We are proceeding with the vote!");
    } else {
        promptVotingToken();
    }
}


//  
document.getElementById('voting-token-button').addEventListener('click', () => {
    console.log('clicked "voting-token-input"')

    let updateQuestionApi
    let xhttp = new XMLHttpRequest();

    let response = ''

    console.log('q_list')
    console.log(q_list)
    xhttp.open("POST", updateQuestionApi, true);
    xhttp.setRequestHeader("Content-type", "application/json");

    let post_obj = { 'allowVote': true }
    console.log(JSON.stringify(post_obj))
    xhttp.send(JSON.stringify(post_obj))
})

// Start BLE server:
document.getElementById('start-BLE-button').addEventListener('click', () => {
    console.log('clicked: start-BLE-button')
    start_BLE_server_process()
})

function goBack() {
    window.history.back();
}

// 
function showExportSection () {
    const exportSection = document.getElementById('step-IV');
    exportSection.style.visibility = 'visible';
}

function exportData() {
    const checkedRadio = document.querySelector('input[name="usb"]:checked');
    if(!checkedRadio) return;

     const path = checkedRadio.value;
        
    
    const url = new URL("http://localhost:3000/dataExport");
    const params = {pathName: path};
    
    url.search = new URLSearchParams(params).toString();
    fetch(url).then(response => response.json())
            .then((body) => {
                    console.log(body);
                     
            }); 
}

function importData() {
    const checkedRadio = document.querySelector('input[name="usb"]:checked');
    if(!checkedRadio) return;

     const path = checkedRadio.value;
        
    
    const url = new URL("http://localhost:3000/dataImport");
    const params = {pathName: path};
    
    url.search = new URLSearchParams(params).toString();
    fetch(url).then(response => response.json())
        .then((body) => {
            //console.log(body);
            let questJSON = JSON.parse(body);
            console.log('questJSON');
            console.log(questJSON);
            
                    
            let questArray = questJSON.election_info.questions;
            for(let i = 0; i < questArray.length; i++){
                let number = i + 1;
                let name = "q" + number;
                let questOps = questArray[i].options;
                let questDiv = document.createElement("div");
                let title = document.createElement("h2");
                title.appendChild(document.createTextNode("Question " + number));
                questDiv.appendChild(title);
                questDiv.appendChild(document.createTextNode(questArray[i].question_description));
                for(let j = 0; j < questOps.length; j++){
                    let number2 = j + 1;
                    let inpt = document.createElement("input");
                    let label = document.createElement("label");
                    questDiv.appendChild(document.createElement("br"));
                    label.style.fontSize = "1em";
                    label.appendChild(document.createTextNode(questOps[j].option_description));
                    questDiv.appendChild(label);
                    inpt.type = "radio";
                    inpt.name = name;
                    inpt.id = name + number2;
                    inpt.value = questOps[j].option_id;
                    inpt.style.height = "2vw";
                    inpt.style.width = "2vh";
                    questDiv.appendChild(inpt);
                    questDiv.appendChild(document.createElement("br"));
                }
                
                document.getElementById("stepIV").appendChild(questDiv);
                console.log(questArray[i]);
            }
            let votingSelection = [];
            let butt = document.createElement("button");
            butt.style.width = "10%";
            butt.style.height = "10%";
            butt.appendChild(document.createTextNode("Submit Votes"));
            butt.onclick = function(){
                votingSelection = [];
                for(let j = 0; j < questArray.length; j++){
                    let num = j + 1;
                    let values = document.getElementsByName("q" + num);
                    let checkVal = null;
                    for(let k = 0; k < values.length; k++){
                        if(values[k].checked){
                           checkVal = values[k].value;
                        }
                    }
                    votingSelection.push(checkVal);
                }
                console.log(votingSelection);
            }
            document.getElementById("stepIV").appendChild(butt);
           


            const electionPackage = new ElectionPackage(body);
            electionPackage.save(() => {
                console.log('saving')
                err && console.log(err);
                console.log(doc)
                document.getElementById("start-BLE-button").style.visibility = "visible";
            })
            document.getElementById("start-BLE-button").style.visibility = "visible"; //FIXME : Remove this line
            
        }); 
}

// Testing because no RPI during development.
function importDataTest() {
    // Test election for when I'm not developing on RPI.
    let test_election = {
    "election_info": {
      "anonymous": true,
      "election_description": "ELECTION FOR THE PRESIDENTE.",
      "election_id": 14,
      "end_time": "2021-03-27T06:00:00+00:00",
      "org_id": 16,
      "public_results": false,
      "questions": [
        {
          "election_id": 14,
          "max_selection_count": 1,
          "min_selection_count": 1,
          "options": [
            {
              "option_description": "Polar bear",
              "option_id": 31
            },
            {
              "option_description": "Grizzly bear",
              "option_id": 32
            },
            {
              "option_description": "Black bear",
              "option_id": 33
            }
          ],
          "ordered_choices": true,
          "question_description": "What bear is best?",
          "question_id": 16
        },
        {
          "election_id": 14,
          "max_selection_count": 1,
          "min_selection_count": 1,
          "options": [
            {
              "option_description": "Fine",
              "option_id": 34
            },
            {
              "option_description": "Well thank you",
              "option_id": 35
            },
            {
              "option_description": "Swell!",
              "option_id": 36
            }
          ],
          "ordered_choices": true,
          "question_description": "How are you?",
          "question_id": 17
        }
      ],
      "start_time": "2021-03-27T05:00:00+00:00",
      "verified": true
    },
    "verifier_password": "batsandcats",
    "voter_list": [
      {
        "user_org_id": "4444",
        "voting_token": [
          "fake_token5.545866420051571e+18"
        ]
      },
            {
        "user_org_id": "4444",
        "voting_token": [
          "token2",
          "token3",
        ]
      }
    ]
    }
    let questJSON = test_election;

    let questArray = questJSON.election_info.questions;

    for (let item of questJSON.voter_list) {
        console.log(item);
        console.log(item.voting_token);
        voting_token_check = voting_token_check.concat(item.voting_token);
    }

    console.log(voting_token_check);

    for(let i = 0; i < questArray.length; i++){
        let number = i + 1;
        let name = "q" + number;
        let questOps = questArray[i].options;
        let questDiv = document.createElement("div");
        let title = document.createElement("h2");
        title.appendChild(document.createTextNode("Question " + number));
        questDiv.appendChild(title);
        questDiv.appendChild(document.createTextNode(questArray[i].question_description));
        for(let j = 0; j < questOps.length; j++){
            let number2 = j + 1;
            let inpt = document.createElement("input");
            let label = document.createElement("label");
            questDiv.appendChild(document.createElement("br"));
            label.style.fontSize = "1em";
            label.appendChild(document.createTextNode(questOps[j].option_description));
            questDiv.appendChild(label);
            inpt.type = "radio";
            inpt.name = name;
            inpt.id = name + number2;
            inpt.value = questOps[j].option_id;
            inpt.style.height = "2vw";
            inpt.style.width = "2vh";
            questDiv.appendChild(inpt);
            questDiv.appendChild(document.createElement("br"));
        }
        
        document.getElementById("stepIV").appendChild(questDiv);
        console.log(questArray[i]);
    }
    let votingSelection = [];
    let submitButton = document.createElement("button");
    submitButton.style.width = "10%";
    submitButton.style.height = "10%";
    submitButton.appendChild(document.createTextNode("Submit Votes"));
    
    // Submit the Vote.
    // TODO: Add the fields for FirstName, LastName, questions.
    submitButton.onclick = function(){
        votingSelection = [];
        for(let j = 0; j < questArray.length; j++){
            let num = j + 1;
            let values = document.getElementsByName("q" + num);
            let checkVal = null;
            for(let k = 0; k < values.length; k++){
                if(values[k].checked){
                    checkVal = values[k].value;
                }
            }
            votingSelection.push(checkVal);
        }
        console.log(votingSelection);

        let vote = {
            voting_token: this_voting_token,
            loation: rpi_location,
            time_stamp: get_current_date_formatted(),
            // FIXME: Add fields for names.
            voter_first_name: "MARK",
            voter_last_name: "KIM",
            question_num: "5",
            choices: []
        }
    }
    document.getElementById("stepIV").appendChild(submitButton);
    


    const electionPackage = new ElectionPackage(body);
    electionPackage.save(() => {
        console.log('saving')
        err && console.log(err);
        console.log(doc)
        document.getElementById("start-BLE-button").style.visibility = "visible";
    })
    document.getElementById("start-BLE-button").style.visibility = "visible"; //FIXME : Remove this line   
}


function showUsbs() {
    fetch('http://localhost:3000/usbs')
  .then(response => response.json())
  .then(data => {
    data = JSON.parse(data);
    console.log(data);
    let usbsDiv = document.getElementById("usbs");
    usbsDiv.innerHTML = "";
        for(const usb of data.usbs){
        if(usb.path == "/" || usb.path == "/boot/efi") continue; // HACK should not show these
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