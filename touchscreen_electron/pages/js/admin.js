console.log('admin.js')
const export_controller = require('../utils/export_tool/export_controller.js');
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
} = require('../utils/pollination-api.js');
const { ipcRenderer } = require('electron');

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

    // TODO: hide step-1 items
})

// step-II: getUserOrgs()
document.getElementById().addEventListener('click', () => {
    console.log('clicked: ')
})

// TODO:step-III: get election list, render it to a div
document.getElementById('get-election-list-button').addEventListener('click', () => {
    console.log('clicked: get-election-list-button')


    // TODO-1: get election list & render election list 
    let org_id = 16 //FIXME: change it to the value entered by the user
    getElectionsList(org_id).then(r => {
        console.log(r)
    })
    // TODO-2: allow the user to choose one election and start downloading
    // TODO-3: hide step-2 items

})

// TODO step-IV: download
document.getElementById('// TODO: create a button ').addEventListener('click', () => {
    console.log('clicked: download-election-package-button')
    // TODO: download package

    let election_id = 15

    let list_display_div = getElementById('election-list-display')

    document.getElementById('download-electron-package-button')
        .addEventListener('click', () => {

        })

})

// TODO: think of a way to do step-III: export json to usb


function exportData() {
    const checkedRadio = document.querySelector('input[name="usb"]:checked');
    if(!checkedRadio) return;

     const path = checkedRadio.value;
        
    
    const url = new URL("http://localhost:4000/dataExport");
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
        
    
    const url = new URL("http://localhost:4000/dataImport");
    const params = {pathName: path};
    
    url.search = new URLSearchParams(params).toString();
    fetch(url).then(response => response.json())
        .then((body) => {
            console.log(body);
            // TODO: Store imported data accordingly
        }); 
}

function showUsbs() {
    fetch('http://localhost:4000/usbs')
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
showUsbs()