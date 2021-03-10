console.log('voting.js')
// const ipc = import('electron').ipcRenderer;

document.getElementById('voting-token-button').addEventListener('click',()=>{
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


