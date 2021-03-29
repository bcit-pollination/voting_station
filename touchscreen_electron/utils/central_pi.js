const { login, electionDownload } = require("../../utils/pollinationAPI");

const central_pi_express_server_js_route = "./servers/admin_express_server.js";

// Store the Questions
const storeQuestionsIntoDB = async(email, password, election_id) => {
    console.log("storeQuestionIntoDB");
    await login(email, password);

    let election_package = electionDownload(election_id).then((p) => {
        console.log(p);
        console.log(p.election_info.questions);
    });
    console.log("=========== election_package ==========");
    console.log(election_package);
};

module.exports = {
    admin_express_server_process,
    storeQuestionsIntoDB,
};