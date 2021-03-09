# bleno_pollination
Pollinaion RPI app using Node.Js bleno module 




## Bluetooth Server(bleno server): 

### Install 

Packages are intended to be install-free,

you do need to set up following the guide at 'https://github.com/noble/bleno':

```sh
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```

### Start

`$ cd BLE_pollination`

start it with `sudo`, since it's touching the kernel.

`$ sudo node peripheral.js`


 
## Raspberry Pi APP(Designed for touch screen): 

### Start

`$ cd touchscreen_electron`

`$ sudo npm start`

