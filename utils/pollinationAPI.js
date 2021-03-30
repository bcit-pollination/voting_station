const axios = require('axios').default;

// Will setup .env variables when this module is first required. Could be early in the start 
// process but due to weird package.json setups, this should be fine.
require('dotenv').config();

const methods = { "GET": "get", "POST": "post", "PUT": "put", "DELETE": "delete" };

//FIXME: env variables are undefined
// const {
//     API_SERVER_PROTOCOL,
//     API_SERVER_ADDRESS,
//     API_SERVER_PORT
// } = process.env;

const API_SERVER_PROTOCOL = "https";
const API_SERVER_ADDRESS = "pollination.live";
const API_SERVER_PORT = "443";



axios.defaults.baseURL = `${API_SERVER_PROTOCOL}://${API_SERVER_ADDRESS}:${API_SERVER_PORT}/api`;
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



/**
 * Attempts to login with the main server. On success, the authorization token will be set for all
 * future calls in this module. logout() will remove the authorization token.
 * 
 * @param {string} email 
 * @param {string} password 
 */
function login(email, password) {
    return new Promise((resolve, reject) => {
        axiosRequest(methods.POST, urlLogin, { email: email, password: password }, null, false)
            .then(resp => {
                axios.defaults.headers.common['Authorization'] = "Bearer " + resp['jwt_token'];
                resolve(resp);
            })
            .catch(err => {
                console.log(err)
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