const axios = require('axios').default;

const urlBase = 'http://pollination.live/api';
const urlLogin = urlRoot + '/user/login';

axios.defaults.baseURL = urlBase;

export function login(username, password) {
    return new Promise((resolve, reject) => {
        axios.post(urlLogin, { username: username, password: password })
            .then(resp => {
                console.log(resp)
                axios.defaults.headers.common['Authorization'] = "Bearer " + resp['jwt_token'];
            })
            .catch(err => {
                console.log(err)
                reject(err);
            });
    })
}


export function logout() {
    axios.defaults.headers.common['Authorization'] = '';
}

function axiosRequest(method, url, data) {
    let requestObject = {
        method: method,
        url: url
    };

    if (data)
        requestObject['data'] = data;

    axios(requestObject);
}