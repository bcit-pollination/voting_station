function fetchQuestionViaMongoConnection() {
    //Mongo Connection
    const MongoClient = require("mongodb").MongoClient;
    // default Mongo connection string
    const mongoHost = "127.0.0.1";
    const userName = "";
    const userPassword = "";
    const mongoPort = 27017;
    const dbName = "test_mongo_schema_creation";
    const collectionName = "questions";

    // fetch questions from DB
    // MongoClient.connect(`mongodb://${userName}:${userPassword}@${mongoHost}:${mongoPort}/`
    MongoClient.connect(
        `mongodb://${mongoHost}:${mongoPort}/`,
        function(err, db) {
            if (err) throw err;
            var dbo = db.db(`${dbName}`);
            dbo
                .collection(collectionName)
                .find({})
                .toArray(function(err, result) {
                    if (err) throw err;
                    // console.log(result);
                    db.close();
                    return result;
                });
        }
    );
}

async function fetchQuestionViaAPI() {
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    // const xhr = new XMLHttpRequest();

    let loadQuestionApi = "http://localhost:3000/getQuestions";

    //    let getQuestionPromise =
    return new Promise(async function(resolve, reject) {
        let xhttp = new XMLHttpRequest();
        let response = "";

        xhttp.open("GET", loadQuestionApi, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                response = this.responseText;

                // console.log(response)
                resolve(response);
            }
            return response;
        };
    });
    // return await getQuestionPromise.then(question => {
    // //    console.log(question)
    //     return question
    // })
}

async function checkVotabliy() {
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    // const xhr = new XMLHttpRequest();

    let checkVotabliyAPI = "http://localhost:3000/CheckVotability";

    //    let getQuestionPromise =
    return new Promise(async function(resolve, reject) {
        let xhttp = new XMLHttpRequest();
        let response = "";

        xhttp.open("GET", checkVotabliyAPI, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                response = this.responseText;

                // console.log(response)
                resolve(response);
            }
            return response;
        };
    });
}

module.exports = {
    fetchQuestionViaAPI: fetchQuestionViaAPI,
    fetchQuestionViaMongoConnection: fetchQuestionViaMongoConnection,
    checkVotabliy: checkVotabliy,
};