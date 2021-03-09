const axios = require('axios').default;

const methods = { "GET": "get", "POST": "post", "PUT": "put", "DELETE": "delete" };

axios.defaults.baseURL = 'http://pollination.live/api';
axios.defaults.headers.common['Authorization'] = '';

const urlLogin = '/user/login';
const urlUser = '/user';
const urlOrg = '/org';
const urlVerifierPass = '/org/verifier_password';
const urlElections = '/org/elections';
const urlElectionVotes = '/org/election/votes';
const urlElectionDownload = '/org/election/download';


export function login(username, password) {
    return new Promise((resolve, reject) => {
        axiosRequest(methods.POST, urlLogin, { username: username, password: password })
            .then(resp => {
                axios.defaults.headers.common['Authorization'] = "Bearer " + resp['jwt_token'];
            })
            .catch(err => {
                reject(err);
            });
    })
}

export function getVerifierPassword(org_id) {
    return axiosRequest(methods.POST, urlVerifierPass, { "org_id": org_id });
}

export function logout() {
    axios.defaults.headers.common['Authorization'] = '';
}

export function electionDownload() {
    return axiosRequest(methods.POST, urlVerifierPass, { "org_id": org_id });
}

function axiosRequest(method, url, data) {
    let requestObject = {
        method: method,
        url: url
    };

    if (data)
        requestObject['data'] = data;

    return new Promise((resolve, reject) => {
        if (!axios.defaults.headers.common['Authorization']) {
            console.log("Missing authorization token, login first");
            reject();
        }

        axios(requestObject)
            .then(resp => {
                console.log(resp)
                resolve(resp);
            })
            .catch(err => {
                console.log(err)
                reject(err);
            });
    });
}