console.log('voting.js')
const export_controller = require('../utils/export_tool/export_controller.js');
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
        loginForm.style.visibility = 'hidden';
        let importStep = document.getElementById('step-II-1');
        importStep.style.visibility = 'visible';
    });

    // TODO: Set appropriate buttons visible, once we figure out functionality of this step.
})


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
            console.log(body);
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