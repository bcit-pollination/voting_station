console.log('voting.js')
// const ipc = import('electron').ipcRenderer;
const ipc = require('electron').ipcRenderer;

// go Back
document.getElementById('go-back').addEventListener('click', () => {
    console.log('clicked: go-back');
    ipc.send("go-back", "cat");
});

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
  