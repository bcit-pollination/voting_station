const bleno = require("bleno"); // https://github.com/sandeepmistry/bleno
const polling = require("./polling");
const PollingService = require("./polling-service");
const {killBLEProcesses} = require('../utils/process');
const { spawn } = require("child_process");
const process = require('process');


// name that will appear when searching for the bluetooth device
const name = "Raspbian Pollination";
const pollingService = new PollingService(new polling.Pizza());

// Wait until the BLE radio powers on before attempting to advertise.
// If you don't have a BLE radio, then it will never power on!
bleno.on("stateChange", function(state) {
    if (state === "poweredOn") {

        // We will also advertise the service ID in the advertising packet,
        // so it's easier to find.
        bleno.startAdvertising(name, [pollingService.uuid], function(err) {
            if (err) console.log(err);
        });

    } else {
        
        bleno.stopAdvertising();
        spawn("sudo", ["kill", process.pid])
        // killBLEProcesses();

    }
});

bleno.on("advertisingStart", function(err) {
    if (!err) {
        console.log("Bluetooth service advertising...");

        // Once we are advertising, it's time to set up our services,
        // along with our characteristics.
        bleno.setServices([pollingService]);
    }
});