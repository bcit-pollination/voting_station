const export_controller = require("../../../utils/export_tool/export_controller");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/pollination", { useNewUrlParser: true });

// stores the jwt returned by login globally
let session_jwt = {};
// stores the election package globally
let election_package = {};

const {
    login,
    getElectionsList,
    electionDownload,
    getUserOrgs,
    electionUpload,
} = require("../../../utils/pollinationAPI.js");
// const { electionDownload } = require('../../utils/pollinationAPI');

const ElectionPackageModel = require('../../../utils/mongo/models/electionPackage');

let button1 = document.getElementById("get-organization-list-button");
let button2 = document.getElementById("download-election-package-button");
let button3 = document.getElementById("import-election-button");
let button4 = document.getElementById("export-election-button");
let button5 = document.getElementById("get-election-list-button");
let button6 = document.getElementById("upload-election-results");
let button7 = document.getElementById("post-election-results");
let button8 = document.getElementById("import-button");
let button9 = document.getElementById("export-button");

// document.getElementById("titleForImpExp").style.display = "none";

// button6.style.display = "none";
// button7.style.display = "none";

// button8.style.display = "none";
// button9.style.display = "none";
// button7.style.display = "none";

// button8.style.display = "none";
// button9.style.display = "none";

// document.getElementById("step-V-I").style.display = "none";

let electionID;

// step-I: login
document
    .getElementById("central-login-button")
    .addEventListener("click", () => {
        console.log("clicked: central-login-button");
        let email = document.getElementById("login-username-input").value;
        let password = document.getElementById("login-password-input").value;
        console.log(email, password);

        // stores the jwt in the global variable
        login(email, password).then((jwt) => {
            session_jwt = jwt;
            console.log(jwt);

            // hides step-I items
            document.getElementById("step-I").style.display = "none";
            // show step-II items
            document.getElementById("step-II").style.display = "block";
        });


    });

// step-II: getUserOrgs()
document
    .getElementById("get-organization-list-button")
    .addEventListener("click", () => {
        console.log("clicked: get-organization-list-button");
    });

// {
//     "orgs": [
//       {
//         "name": "test3",
//         "org_id": 29,
//         "privilege": 4,
//         "user_org_id": "<string>"
//       }
//     ]
//   }

// TODO:step-III: get election list, render it to a div
 function getElectionButtHandler(){
             // hides step-II items
             document.getElementById("step-II").style.display = "none";
             // show step-III items
             document.getElementById("step-III").style.display = "block";

        console.log("clicked: get-election-list-button");
        // button5.style.display = "none";
        // button7.style.display = "none";
        let electionDisplay = document.getElementById("election-list-display");
        // electionDisplay.innerHTML = "<h2>List of Elections:</h2>";
        electionDisplay.style.display = 'block'
        electionDisplay.style.visibility = 'visible'

        let org_id;
        getUserOrgs().then((r) => {
            console.log(r);
            org_id = r.orgs[0].org_id;
            console.log(org_id);
            let list = getElectionsList(org_id).then((list) => {
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
                    electionTitleHeaderButton.onclick = function () {
                        electionID = item.election_id;
                        button2.style.display = "inline";
                        button6.style.display = "inline";
                    };
                }
            });
        });

        // TODO-2: allow the user to choose one election and start downloading

        // This part of the function, handles hiding the buttons when the table is generated,
        // and creates a return button to bring it all back.

        // button1.style.display = "none";
        // button2.style.display = "none";
        // button3.style.display = "none";
        // button4.style.display = "none";
        // button5.style.display = "none";
        // button6.style.display = "none";
        // button7.style.display = "none";
        // button8.style.display = "none";
        // button9.style.display = "none";
    }

// TODO step-IV: download
//Added the download-electron-package id to the getelementbyid statement.



function downloadElectionPackage() {
    electionDownload(electionID).then(async (result) => {
        console.log("Election package from api", result);
        let electionPackage = new ElectionPackageModel(result);
        // Clear all election packages and insert new package

        await ElectionPackageModel.remove({});
        const savedElection = electionPackage.save(function (err) {
            if (err) console.log(err);
        });

        button6.style.display = "none";
        button2.style.display = "none";

        document.getElementById("step-II").style.display = "none";
        // document.getElementById("titleForImpExp").style.display = "block";

        // button8.style.display = "inline";
        // button9.style.display = "inline";
        document.getElementById("step-III").style.display = "none";
             // show step-III items
             document.getElementById("step-V").style.display = "block";

        document.getElementById("step-V-II").style.display = "none";
    });
}
/** 
function downloadElectionPackage() {
    electionDownload(electionID).then((result) => {
        console.log(result);
        let electionPackage = new ElectionPackageModel(result);
        ElectionPackageModel.remove({}, (err, res) => {
            err && console.log(err);
            electionPackage.save((err, doc) => {
                console.log("saving");
                err && console.log(err);
                console.log(doc);
                showExportSection();

                return;
            });
        });
    });
    //Once election package is downloaded
    console.log("Hit");
}
*/
// TODO: think of a way to do step-III: export json to usb

function showImportSection() {
    // document.getElementById("titleForImpExp").style.display = "none";
    // button8.style.display = "none";
    // button9.style.display = "none";
    const importSection = document.getElementById("step-V-I");
    importSection.style.display = "block";

    document.getElementById("step-III").style.display = "none";
}

function showImportSection() {
    // document.getElementById("titleForImpExp").style.display = "none";
    // button8.style.display = "none";
    // button9.style.display = "none";
    const exportSection = document.getElementById("step-V");
    document.getElementById("step-V-I").style.display='none'
    exportSection.style.display = "block";
}

function exportData() {
    console.log('exportData');
    const checkedRadio = document.querySelector('input[name="usb"]:checked');
    if (!checkedRadio) return;

    const path = checkedRadio.value;

    const url = new URL("http://localhost:4000/dataExport");
    const params = { pathName: path };

    url.search = new URLSearchParams(params).toString();
    fetch(url)
        .then((response) => response.json())
        .then((body) => {
            console.log(body);
            alert('Exported Successfully!!!!')

        });
    //document.getElementById("step-II").style.display = "none";
    //document.getElementById("step-V").style.display = "none";
}

function importData() {
    const checkedRadio = document.querySelector('input[name="usb"]:checked');
    if (!checkedRadio) return;

    const path = checkedRadio.value;

    const url = new URL("http://localhost:4000/dataImport");
    const params = { pathName: path };

    url.search = new URLSearchParams(params).toString();
    fetch(url)
        .then((response) => response.json())
        .then((body) => {
            console.log(body);
            
            document.getElementById("step-V").style.display = "none";
            document.getElementById("step-VI").style.display = "block";
            alert('Votes imported successfully !!!!!!!')
        }).catch((err)=>{
            alert(`Failed!: ${err}`)
        });

    //document.getElementById("step-II").style.display = "none";
    //document.getElementById("step-V-I").style.display = "none";
}

function showUsbs() {
    fetch("http://localhost:4000/usbs")
        .then((response) => response.json())
        .then((data) => {
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
        });
}


async function axiosPOST() {
    let data = {
        election_id: election_id,
        votes_cast: votes_cast,
    };
    electionUpload(data);
    let axiosResult = await axios.post(
        "https://pollination.live/api/org/election/votes",
        data
    );
    console.log(axiosResult);
    console.log(axiosResult.data);
    let axiosResultData = axiosResult.data;
    alert(axiosResultData);
    window.history.back();
}

function uploadElectionResults() {
    console.log('clicked uploadElectionResults')
    const url = new URL("http://localhost:4000/uploadElectionResults");
    // const params = { pathName: path };

    // url.search = new URLSearchParams(params).toString();

    fetch(url)
        .then((response) => response.json())
        .then((body) => {
            electionUpload(body).then((r) => {
                console.log(body)
                alert(`Upload Success!: ${body}`)

            }).catch(err=> alert(`Upload Success!: ${body}`))
            // console.log(body);
            // TODO: Store imported data accordingly
        });
    document.getElementById("step-II").style.display = "none";
    button2.style.display = "none";
    button6.style.display = "none";
}