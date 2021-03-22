console.log('admin.js')


const ipc = window.require('electron').ipcRenderer;

// stores the jwt returned by login globally
let session_jwt = {}
// stores the election package globally
let election_package = {}

const {
    // start_load_question_process,
    start_BLE_server_process,
    // voting_express_server_process,
} = require('../utils/voting_pi')


const {
    login,
    getElectionsList,
    electionDownload,
} = require('../utils/pollination-api.js');
// const { electionDownload } = require('../../utils/pollination-api');

const {
    ElectionPackageSchema,
    ElectionPackage,
    Schema,
} = require ('../utils/load-questions.js')

// go Back
document.getElementById('go-back').addEventListener('click', () => {
    console.log('clicked: go-back');
    ipc.send("go-back", "cat");
});

// step-I: login
document.getElementById('central-login-button').addEventListener('click', () => {
    console.log('clicked: central-login-button')
    let email = document.getElementById('login-username-input').value
    let password = document.getElementById('login-password-input').value
    console.log(email, password)

    // stores the jwt in the global variable
    login(email, password).then((jwt) => {
        session_jwt = jwt;
        console.log(jwt)
    });
    

    // hides step-1 items
    document.getElementById('step-I').style.display = "none";
})

// step-II: getUserOrgs()
document.getElementById('get-organization-list-button').addEventListener('click', () => {
    console.log('clicked: ')
})

// TODO:step-III: get election list, render it to a div
document.getElementById('get-election-list-button').addEventListener('click', () => {
    console.log('clicked: get-election-list-button')

    let electionDisplay = document.getElementById("election-list-display");
    electionDisplay.innerHTML = "<h2>List of Elections:</h2>";

    let org_id = 16 //FIXME: change it to the value entered by the user
    let list = getElectionsList(org_id).then(list => {
        for (let item of list.elections) {
            let electionItem = document.createElement("table");
            electionItem.style.border = "thin solid black";
            electionItem.style.width = "66%";
            electionItem.style.alignItems = "center";
            electionItem.style.textAlign = "center";

            let electionTitleRow = document.createElement("tr");
            electionItem.appendChild(electionTitleRow);
            let electionTitleHeader = document.createElement("td");
            electionTitleRow.appendChild(electionTitleHeader);
            electionTitleHeader.colSpan = 2;
            electionTitleHeader.style.textAlign = "center";
            let electionTitleHeaderButton = document.createElement("button");
            electionTitleHeader.appendChild(electionTitleHeaderButton);
            electionTitleHeaderButton.innerHTML = item.election_description;
            electionTitleHeaderButton.style.fontWeight = "bold";
            electionTitleHeaderButton.style.borderRadius = "3px";

            let startRow = document.createElement("tr");
            electionItem.appendChild(startRow);
            let startTitle = document.createElement("td");
            startRow.appendChild(startTitle);
            startTitle.innerHTML = "Start Time";
            let startData = document.createElement("td");
            startRow.appendChild(startData);
            startData.innerHTML = item.start_time;

            let endRow = document.createElement("tr");
            electionItem.appendChild(endRow);
            let endTitle = document.createElement("td");
            endRow.appendChild(endTitle);
            endTitle.innerHTML = "End Time";
            let endData = document.createElement("td");
            endRow.appendChild(endData);
            endData.innerHTML = item.start_time;

            let br = document.createElement("br");

            electionDisplay.appendChild(electionItem);
            electionDisplay.appendChild(br);

            // FIXME: Check if the .save() saves to the MongoDB
            electionTitleHeaderButton.onclick = function() {
                let id = item.election_id;
                electionDownload(18).then(result => {
                    result.save((err, doc) => {
                        console.log('saving')
                        err && console.log(err);
                        console.log(doc)
                        return
                    })
                });
            }
        };
    });

    // TODO-2: allow the user to choose one election and start downloading

    // This part of the function, handles hiding the buttons when the table is generated, 
    // and creates a return button to bring it all back.

    let button1 = document.getElementById('get-organization-list-button');
    let button2 = document.getElementById('download-electron-package-button');
    let button3 = document.getElementById('import-election-button');
    let button4 = document.getElementById('export-election-button');
    let button5 = document.getElementById('get-election-list-button');

    button1.style.visibility = 'hidden';
    button2.style.visibility = 'hidden';
    button3.style.visibility = 'hidden';
    button4.style.visibility = 'hidden';
    button5.style.visibility = 'hidden';

    let returnButton = document.createElement('button');
    returnButton.innerHTML = "Return";
    returnButton.onclick = function() {
        button1.style.visibility = 'visible';
        button2.style.visibility = 'visible';
        button3.style.visibility = 'visible';
        button4.style.visibility = 'visible';
        button5.style.visibility = 'visible';
        electionDisplay.innerHTML = "<h2>List of Elections:</h2>";
    }
    electionDisplay.appendChild(returnButton);

})

// TODO step-IV: download
//Added the download-electron-package id to the getelementbyid statement.
document.getElementById('download-electron-package-button').addEventListener('click', () => {
    console.log('clicked: download-election-package-button')
    // TODO: download package

    let election_id = 15

    let list_display_div = getElementById('election-list-display')

    document.getElementById('download-electron-package-button')
        .addEventListener('click', () => {

        })

})

// TODO: think of a way to do step-III: export json to usb


function goBack() {
    window.history.back();
  }
  
