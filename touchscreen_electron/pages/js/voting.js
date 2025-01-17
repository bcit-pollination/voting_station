const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pollination", { useNewUrlParser: true });

// let global_JSON = {}

const { getCurrentDateFormatted } = require("../../../utils/dateFormat");
const { login } = require("../../../utils/pollinationAPI");
const { startBLEServerProcess } = require("../../../utils/process");
const { checkPassword, decodeBase64 } = require("../../../utils/passwordHash");
const ElectionPackageModel = require("../../../utils/mongo/models/electionPackage");
const QuestionModel = require("../../../utils/mongo/models/question");
const VotesCastSchema = require("../../../utils/mongo/models/question");
const VoteModel = require('../../../utils/mongo/models/vote')
const axios = require("axios");
const options = require("../../../utils/mongo/models/options");

let rpi_location = "";
let voting_token_check = [];
let this_voting_token = "";
let questJSON = null;
let votes_cast = [];
let election_id = null;

function votingLoginButtonHandler() {
    console.log('clicked: voting-login-button')
    let email = document.getElementById('login-username-input').value
    let password = document.getElementById('login-password-input').value
    console.log(email, password);

    // stores the jwt in the global variable
    login(email, password).then((jwt) => {
        session_jwt = jwt;
        console.log(jwt);

        // let importStep = document.getElementById('step-II-1');
        // importStep.style.visibility = 'visible';

        // let loginForm = document.getElementById('step-I');
        // loginForm.style.visibility = 'hidden'; 

        // {state&&<?>}
        document.getElementById('step-I').style.display = 'none'
        document.getElementById('step-II').style.display = 'block'
        document.getElementById('step-II-0').style.display = 'block'
        document.getElementById('step-II-1').style.display = 'none'
        document.getElementById('step-II-2').style.display = 'none'
        // document.getElementById('step-II-3').style.display = 'none'       
    });
}
function BLEbuttonHandler(){
    startBLEServerProcess();
    document.getElementById('start-BLE-button').style.display='none';
}
async function checkVerifierPassword() {
    // let loginPromise = new Promise(async(resolve,reject)=>{
    //   resolve(password)
    // })

    let verifier_password = document.getElementById("verifier-password-input").value;
    // FIXME : remove the hardcoded
    console.log(verifier_password)
    // let package = await ElectionPackageModel.findOne({})
    // ElectionPackageModel.find({},(err,res)=>{
    //     console.log(err)
    //     console.log(res)
    // })

    let query = ElectionPackageModel.where({});
    ElectionPackageModel.find({}, function (err, election) {
        if (err) return console.log(err);
        console.log(election[0]);

        if (checkPassword(verifier_password, decodeBase64(election[0]['verifier_password']))) {
            alert('verification successful')

            // Let the Verifier add the location. Submit button uses submitLocation.
            let loginForm = document.getElementById('step-I');
            loginForm.innerHTML = "<center><h2>Please enter the location of<br>this polling station.</h2><br><br><input type='text' id='rpi-location-id' /><br><br><button onclick = 'submitLocation()'>Submit</button></center>";
            // loginForm.style.visibility = 'visible';

            // let verifierPrompt = document.getElementById('step-II-0');
            document.getElementById('step-II-0').style.display = 'none';
            document.getElementById('step-II-1').style.display = 'none';
            document.getElementById('step-II-2').style.display = 'block';
            document.getElementById('step-III').style.display = 'block';
        }
        else {
            alert('verify failed')
        }
    })
}

async function checkVerifierPassword2(verifier_password) {
    // let loginPromise = new Promise(async(resolve,reject)=>{
    //   resolve(password)
    // })

    // let verifier_password = document.getElementById("verifier-password-input").value;
    // FIXME : remove the hardcoded
    console.log(verifier_password)
    // let package = await ElectionPackageModel.findOne({})
    // ElectionPackageModel.find({},(err,res)=>{
    //     console.log(err)
    //     console.log(res)
    // })

    let query = ElectionPackageModel.where({});
    ElectionPackageModel.find({}, function (err, election) {
        if (err) return console.log(err);
        console.log(election[0]);

        if (checkPassword(verifier_password, decodeBase64(election[0]['verifier_password']))) {
            alert('verify successful')
            hideEndVoteSection()
            showExportSection()

            
        }
        else {
            alert('verify failed')
        }
    })
}

function submitLocation() {

    // Set rpi_location to the Location.
    let this_location = document.getElementById("rpi-location-id").value;
    rpi_location = this_location;
    console.log("The location has been set to: " + rpi_location);

    document.getElementById("step-III").style.display = 'none'
    document.getElementById("step-IV").style.display = 'block'
    // Clear login page.
    promptVotingToken();
}

function promptVotingToken() {
    console.log('promptVotingToken')
    // showExportSection();
    document.getElementById('step-vote').style.display = 'none'
    document.getElementById('step-IV').style.display = 'block'


    // generateValidTokenList(questJSON);
}

function submitVotingToken() {
    generateValidTokenList(questJSON)
    // loadPoll(questJSON)

    this_voting_token = document.getElementById("voting-token-input").value;
    console.log(this_voting_token)
    console.log("this_voting_token: " + this_voting_token);

    console.log("Valid voting tokens:");
    console.log(voting_token_check);

    if (voting_token_check.includes(this_voting_token)) {
        alert('Verification Successful, Proceed to Vote')
        loadPoll(questJSON);
        // hideExportSection();
    } else {
        alert('Invalid Voting Token')
        promptVotingToken();
    }
}

function EndElection() {
    alert('Enter Password to Proceed')
}

function loadPoll(questJSON) {
    document.getElementById('step-vote').style.display = 'block'
    document.getElementById('step-IV').style.display = 'none'
    document.getElementById('step-check-verifier-password-before-ending').style.display = 'none'

    // let loginForm = document.getElementById('step-I');
    // loginForm.innerHTML = "";

    let questArray = questJSON.election_info.questions;
    let questIdArray = [];

    document.getElementById("step-vote-question-div").innerHTML = "";

    console.log(questArray);

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
            let label = document.createElement("label");
            questDiv.appendChild(document.createElement("br"));
            label.style.fontSize = "1em";
            label.appendChild(document.createTextNode(questOps[j].option_description));
            questDiv.appendChild(label);

            if (questArray[i].ordered_choices == true) {
                let inpt = document.createElement("select");
                inpt.name = name;
                inpt.id = name + number2;
                console.log(inpt.id);
                inpt.style.height = "2vw";
                inpt.style.width = "8vh";
                for (let k = 0; k < questOps.length; k++) {
                    let option = document.createElement("option");
                    option.optionVal = questArray[i].options[k].option_id;
                    console.log(option.optionVal);
                    option.value = k + 1;
                    option.text = k + 1;
                    inpt.add(option);
                }
                questDiv.appendChild(inpt);
                questDiv.appendChild(document.createElement("br"));
            } else {
                let inpt = document.createElement("input");
                if (questArray[i].max_selection_count == 1 && questArray[i].min_selection_count == 1) {
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

        }
        document.getElementById("step-vote-question-div").appendChild(questDiv);
        console.log(questArray[i]);
    }

    let submitButton = document.getElementById("submit-question-button");
    // submitButton.style.width = "10%";
    // submitButton.style.height = "10%";
    // submitButton.appendChild(document.createTextNode("Submit Votes"));

    // Submit the Vote.
    submitButton.onclick = async function () {
        alert('Vote Submitted')

        document.getElementById('step-vote').style.display = 'none'

        document.getElementById('step-IV').style.display = 'block'

        console.log(submitButton)
        let votingSelections = [];
        // looping through

        for (let j = 0; j < questArray.length; j++) {
            if (questArray[j].ordered_choices == true) {
                let num = j + 1;
                let values = document.getElementsByName("q" + num);
                for (let k = 0; k < questArray[j].options.length; k++) {
                    let questionNumber = j + 1;
                    let questionAnswerNumber = k + 1;
                    let question = document.getElementById("q" + questionNumber + questionAnswerNumber);
                    let result = question.options[question.selectedIndex].value;
                    let result2 = question.options[question.selectedIndex].optionVal;
                    console.log(result2);
                    let choiceObject = {
                        option_id: result2,
                        // HACK:  Leaving as 0 for now.
                        order_position: parseInt(result),
                        question_id: questArray[j].question_id,
                    };
                    await votingSelections.push(choiceObject);
                }
            } else {
                let num = j + 1;
                let values = document.getElementsByName("q" + num);
                let checkVal = null;

                //REVIEW:
                // If user selected more than just one
                //  a brand new object needs to be there, with the same option_id
                // eg:
                // {question_id:19, option_id:17, order_position: 0}
                // {question_id:19, option_id:18, order_position: 0}
                // {question_id:19, option_id:19, order_position: 0}

                for (let k = 0; k < values.length; k++) {
                    if (values[k].checked) {
                        checkVal = values[k].value;
                        let choiceObject = {
                            option_id: parseInt(checkVal),
                            // HACK:  Leaving as 0 for now.
                            order_position: 0,
                            question_id: questArray[j].question_id,
                        };
                        await votingSelections.push(choiceObject);
                    }
                }
            }
        }

        console.log(votingSelections);
        // votingSelections = new

        // FIXME: It's saving 2 objects, one of which is empty
        let vote = {
            choices: votingSelections,
            location: rpi_location,
            time_stamp: getCurrentDateFormatted(),
            // HACK: not needed for the video
            voter_first_name: "MARK",
            voter_last_name: "KIM",
            voting_token: this_voting_token,
        };
        console.log('vote:')
        console.log(vote);

        vote = new VoteModel(vote)
        vote.save({}, (err, res) => {
            err && console.log(err)
            res && console.log(res)
        })

        // // SAVE VOTES INTO DB USING Mongoose
        // let axiosResult = axios.post("http://localhost:3000/postVotes", vote);

        // votes_cast.push(vote);
        // console.log(votes_cast);

        // let vote_div = document.getElementById("step-IV");
        // vote_div.appendChild(submitButton);
        // vote_div.style.visibility = "hidden";



    };
    // appending the submit button , make it visible
    // let vote_div = document.getElementById("step-IV");
    // vote_div.appendChild(submitButton);
    // vote_div.style.visibility = "visible";

    // document.getElementById("voting-token-button").addEventListener("click", () => {
    //         console.log('clicked "voting-token-input"');

    //         let updateQuestionApi;
    //         let xhttp = new XMLHttpRequest();

    //         let response = "";

    //         console.log("q_list");
    //         console.log(q_list);
    //         xhttp.open("POST", updateQuestionApi, true);
    //         xhttp.setRequestHeader("Content-type", "application/json");

    //         let post_obj = { allowVote: true };
    //         console.log(JSON.stringify(post_obj));
    //         xhttp.send(JSON.stringify(post_obj));
    //     });

    // showExportSection();
}

function generateValidTokenList(questJSON) {
    for (let item of questJSON.voter_list) {
        console.log(item);
        console.log(item.voting_token);
        voting_token_check = voting_token_check.concat(item.voting_token);
    }
    console.log("list of valid token ids:");
    console.log(voting_token_check);
}

function showEndVoteSection() {
    alert('Enter Password to End the Election')
    document.getElementById('step-vote').style.display = 'none'
    document.getElementById('step-check-verifier-password-before-ending').style.display = 'block'
    
}

function hideEndVoteSection() {
    document.getElementById('step-check-verifier-password-before-ending').style.display = 'none'
}


function showExportSection() {
    const exportSection = document.getElementById("step-export-votes");
    exportSection.style.display = "block";
}

function hideExportSection() {
    const exportSection = document.getElementById("step-export-votes");
    exportSection.style.display = "none";
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
            alert('Data Exported to Selected USB Device.')
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
            // importStep.style.visibility = 'hidden';

            let verifier = document.getElementById('step-II-0');
            // verifier.style.visibility = 'visible';


            questJSON = JSON.parse(body);
            console.log('questJSON');
            console.log(questJSON);

            save_election_package_and_questions(questJSON)
            document.getElementById("step-II-0").style.display = 'none'
            document.getElementById("step-II-1").style.display = 'block'
            document.getElementById("step-II-2").style.display = 'none'
            alert('Election Package Successfully Imported !!!!')
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

    // // Start BLE server:
    // let startBLEbutton = document.getElementById("start-BLE-button");
    // startBLEbutton.addEventListener("click", () => {
    //     console.log("clicked: start-BLE-button");
    //     startBLEServerProcess();
    //     // startBLEbutton.style.visibility = 'hidden';
    // });
}

function save_election_package_and_questions(questJSON) {
    const electionPackage = new ElectionPackageModel(questJSON);

    ElectionPackageModel.remove({}, (err, res) => {
        electionPackage.save((err, doc) => {
            console.log('saving')
            err && console.log(err);
            console.log('saved package')
            console.log(doc)
        })
    })

    console.log('removing questions');
    mongoose.connection.db.dropCollection('questions', (err, res) => {
        err && console.log(err);
        console.log('saving questions')
        for (let question of electionPackage.election_info.questions) {
            const question_obj_to_save = new QuestionModel(question)
            question_obj_to_save.save((err, doc) => {
                err && console.log(err);
                console.log('saving question:')
                console.log(doc)
            })
        }
    })
    // let removed = QuestionModel.deleteMany({})
    // console.log(removed)
    // document.getElementById("step-II-2").style.visibility = "visible";
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
                // usbsDiv.style.visibility ='visible'
            }

        })
}

function showUsbs2() {
    fetch('http://localhost:3000/usbs')
        .then(response => response.json())
        .then(data => {
            data = JSON.parse(data);
            console.log(data);
            let usbsDiv = document.getElementById("usbs2");

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
                // usbsDiv.style.visibility ='visible'
            }

        })
}

function goBack() {
    window.history.back();
}

