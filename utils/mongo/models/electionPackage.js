const mongoose = require("mongoose");
const Voter = require("./voter");
const Question = require("./question");

const { Schema } = mongoose;


const electionPackageSchema = new Schema({
    // the two primary fields
    voter_list: [Voter.schema],
    verifier_password: String,
    // nested fields
    election_info: {
        election_id: Number, // used for getting the package
        org_id: String, // used for rendering
        anonymous: Boolean,
        public_results: String,
        election_description: String,

        // deals with time period
        start_time: String,
        end_time: String,

        // most important
        questions: [Question.schema], // question objects
        verified: Boolean, // type of votes
    },
});

module.exports = mongoose.model("ElectionPackage", electionPackageSchema);