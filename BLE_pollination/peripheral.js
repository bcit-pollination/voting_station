const util = require('util');


//
// Require bleno peripheral library.
// https://github.com/sandeepmistry/bleno
const bleno = require('bleno');

const polling = require('./polling');

// Services imported
const PollingService = require('./polling-service');

//
// A name to advertise our Polling Service.
//
const name = 'Raspbian Pollination';
const pollingService = new PollingService(new polling.Pizza());


const express = require('express')


// HACK: allow us to kill the BLE process by port
const app = express()
const port = 5000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


//
// Wait until the BLE radio powers on before attempting to advertise.
// If you don't have a BLE radio, then it will never power on!
//
console.log("entered");
bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // We will also advertise the service ID in the advertising packet,
    // so it's easier to find.
    //
    bleno.startAdvertising(name, [pollingService.uuid], function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
  else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(err) {
  if (!err) {
    console.log('advertising!!!...');
    
    //
    // Once we are advertising, it's time to set up our services,
    // along with our characteristics.
    //
    bleno.setServices([
      pollingService
    ]);
  }
});
