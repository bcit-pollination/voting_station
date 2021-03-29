let vote_data_json =
    { "obj": { "choices": [{ "option_id": 1, "option_description": "Sandwich", "_id": "6046757f2801bc7728000005", "isChecked": true }, { "option_num": 2, "option_description": "Pizza", "_id": "6046757f2801bc7728000004", "isChecked": true }, { "option_num": 3, "option_description": "SuShi", "_id": "6046757f2801bc7728000003", "isChecked": true }], "voting_token": "14efcd7a-ce61-41d3-83f8-d58f440054fc", "time_stamp": 1615272877249 } }
console.log('User Voted For : \n')

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;




let xhttp = new XMLHttpRequest();

let response = ''

xhttp.open("POST", "http://localhost:3000/postVotes", true);
xhttp.setRequestHeader("Content-Type", "application/json");

let post_obj = { 'obj': vote_data_json }
console.log(JSON.stringify(post_obj))

xhttp.send(JSON.stringify(post_obj))
// xhttp.send(JSON.stringify(q_list));

xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        response = this.responseText;
        // resolve(response)
    }
}