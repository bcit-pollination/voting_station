const api = require('./pollinationAPI');

async function test_pollination_api() {
    let resp;
    resp = await api.login('test@test.com', 'testtest');
    resp = await api.electionDownload(6);
    resp = await api.getVerifierPassword(5);
    resp = await api.getUserOrgs();
    resp = await api.getElectionsList(5);
    resp = await api.getUserInfo();
    resp = await api.getUserVotingToken();
    resp = await api.getOrg(5);
    resp = await api.getOrgUsers(5);
    resp = await api.getElectionInfo(6);

    await api.logout()
    resp = await api.electionDownload(6);
}

/**
 *  Use for testing electionUpload.
 */
function test_election_upload_api() {
    api.login('test@test.com', 'testtest');

    let voteObj = {
        "election_id": 4,
        "votes_cast": [{
            "choices": [{
                "option_id": 2,
                "order_position": 4,
                "question_id": 1
            }],
            "location": "Alberta",
            "time_stamp": "2021-01-30T08:30:00+07:30",
            "voter_first_name": "Mary",
            "voter_last_name": "Kelley",
            "voting_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwb2xsaW5hdGlvbi5saXZlIiwiaWF0IjoxNjE1MzU0Mjk4LCJleHAiOjE2MjEzNTQyOTgsInVpZCI6IjgifQ.shrbzrSNbU6DOcnBWFPdyo5DiF0wGM4bp8R1BkxpjXM"
        }]
    };

    api.electionUpload(voteObj);
}