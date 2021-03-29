var util = require("util");
var bleno = require("bleno");

var MultiVoteCharacteristic = require("./votes-handler");

function PollingService(poll) {
    bleno.PrimaryService.call(this, {
        uuid: "13333333333333333333333333333337",

        //
        characteristics: [new MultiVoteCharacteristic(poll)],
    });
}

util.inherits(PollingService, bleno.PrimaryService);

module.exports = PollingService;