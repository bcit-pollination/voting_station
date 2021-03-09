var util = require('util');
var bleno = require('bleno');




var SingleVoteCharacteristic = require('./single-votes');
var MultiVoteCharacteristic = require('./multi-votes');

function PollingService(poll) {
    bleno.PrimaryService.call(this, {
        uuid: '13333333333333333333333333333337',

        //
        characteristics: [
            new SingleVoteCharacteristic(poll),
            new MultiVoteCharacteristic(poll)
        ]
    });
}

util.inherits(PollingService, bleno.PrimaryService);

module.exports = PollingService;
