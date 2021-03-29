const util = require("util");
const bleno = require("bleno");

const VoteHandler = require("./votes-handler");

function PollingService(poll) {
    bleno.PrimaryService.call(this, {
        uuid: "13333333333333333333333333333337", // 
        characteristics: [new VoteHandler(poll)], // 
    });
}

util.inherits(PollingService, bleno.PrimaryService);

module.exports = PollingService;