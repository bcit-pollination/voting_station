const axios = require('axios').default;

const methods = { "GET": "get", "POST": "post", "PUT": "put", "DELETE": "delete" };

axios.defaults.baseURL = 'http://pollination.live/api';
axios.defaults.headers.common['Authorization'] = '';

const urlLogin = '/user/login';
const urlUser = '/user';
const urlOrg = '/org';
const urlVotingToken = '/user/voting_token';
const urlOrgList = '/org/list';
const urlOrgUsers = '/org/list';
const urlVerifierPass = '/org/verifier_password';
const urlElections = '/org/elections';
const urlElectionsList = '/org/elections/list';
const urlElectionVotes = '/org/election/votes';
const urlElectionDownload = '/org/election/download';


function login(email, password) {
    return new Promise((resolve, reject) => {
        axiosRequest(methods.POST, urlLogin, { email: email, password: password }, null, false)
            .then(resp => {
                axios.defaults.headers.common['Authorization'] = "Bearer " + resp['jwt_token'];
                resolve(resp);
            })
            .catch(err => {
                reject(err);
            });
    })
}

function getVerifierPassword(org_id) {
    return axiosRequest(methods.POST, urlVerifierPass, data = { "org_id": org_id });
}

function logout() {
    axios.defaults.headers.common['Authorization'] = '';
}

function getOrg(org_id) {
    return axiosRequest(methods.GET, urlOrg, null, { org_id: org_id });
}

function getElectionInfo(election_id) {
    return axiosRequest(methods.GET, urlElections, null, { election_id: election_id });
}

function electionDownload(election_id) {
    return axiosRequest(methods.GET, urlElectionDownload, null, { election_id: election_id });
}

function electionUpload(election) {
    return axiosRequest(methods.POST, urlElectionVotes, election);
}

function getElectionsList(org_id) {
    return axiosRequest(methods.GET, urlElectionsList, null, { org_id: org_id });
}

function getUserInfo() {
    return axiosRequest(methods.GET, urlUser);
}

function getUserVotingToken() {
    return axiosRequest(methods.GET, urlVotingToken);
}

function getUserOrgs() {
    return axiosRequest(methods.GET, urlOrgList);
}

function getOrgUsers(org_id) {
    return axiosRequest(methods.GET, urlOrgUsers, null, { org_id: org_id });
}

function axiosRequest(method, url, data = null, params = null, authorized = true) {
    let requestObject = {
        method: method,
        url: url
    };

    if (data)
        requestObject['data'] = data;

    if (params)
        requestObject['params'] = params;

    return new Promise((resolve, reject) => {
        if (authorized && !axios.defaults.headers.common['Authorization']) {
            console.log("Missing authorization token, login first");
            return reject();
        }

        console.log('Sending request to pollination server\n', requestObject)

        axios(requestObject)
            .then(resp => {
                console.log("Pollination server response\n", resp.data)
                resolve(resp.data);
            })
            .catch(err => {
                console.log("Pollination API call error\n", err.response.data)
                reject(err.response.data);
            });
    });
}

async function test() {
    let resp;
    resp = await login('test@test.com', 'testtest');
    resp = await electionDownload(6);
    resp = await getVerifierPassword(5);
    resp = await getUserOrgs();
    resp = await getElectionsList(5);
    resp = await getUserInfo();
    resp = await getUserVotingToken();
    resp = await getOrg(5);
    resp = await getOrgUsers(5);
    resp = await getElectionInfo(6);

    await logout()
    resp = await electionDownload(6);
}

//test();

/** Use for testing electionUpload.
login('test@test.com', 'testtest');
  
let voteObj = {
  "election_id": 4,
  "votes_cast": [
    {
      "choices": [
        {
          "option_id": 2,
          "order_position": 4,
          "question_id": 1
        }
      ],
      "location": "Alberta",
      "time_stamp": "2021-01-30T08:30:00+07:30",
      "voter_first_name": "Mary",
      "voter_last_name": "Kelley",
      "voting_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwb2xsaW5hdGlvbi5saXZlIiwiaWF0IjoxNjE1MzU0Mjk4LCJleHAiOjE2MjEzNTQyOTgsInVpZCI6IjgifQ.shrbzrSNbU6DOcnBWFPdyo5DiF0wGM4bp8R1BkxpjXM"
    }
  ]
};

electionUpload(voteObj);

*/

module.exports = {
    login,
    logout,
    getVerifierPassword,
    electionDownload,
    electionUpload,
    getUserOrgs,
    getElectionsList,
    getUserInfo,
    getUserVotingToken,
    getOrg,
    getOrgUsers,
    getElectionInfo
}