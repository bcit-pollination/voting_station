const axios = require('axios').default;

const methods = { "GET": "get", "POST": "post", "PUT": "put", "DELETE": "delete" };

axios.defaults.baseURL = 'http://pollination.live/api';
axios.defaults.headers.common['Authorization'] = '';

const urlLogin = '/user/login';
const urlUser = '/user';
const urlOrg = '/org';
const urlOrgList = '/org/list';
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

function electionDownload(election_id) {
    return axiosRequest(methods.GET, urlElectionDownload, null, { election_id: election_id });
}

function electionUpload(election) {
    return axiosRequest(methods.POST, urlElectionVotes, election);
}

function getElectionsList(org_id) {
    return axiosRequest(methods.GET, urlElectionsList, null, { org_id: org_id });
}

function getUserOrgs() {
    return axiosRequest(methods.GET, urlOrgList);
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

    console.log("authorized", authorized);

    return new Promise((resolve, reject) => {
        if (authorized && !axios.defaults.headers.common['Authorization']) {
            console.log("Missing authorization token, login first");
            return reject();
        }

        axios(requestObject)
            .then(resp => {
                console.log(resp.data)
                resolve(resp.data);
            })
            .catch(err => {
                console.log(err.response.data)
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
    getElectionsList
}