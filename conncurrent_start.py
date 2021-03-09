import os;
import threading

os.system('ls')
def start_electron():
    # os.system('cd touchscreen_electron/servers && node voting_express_server.js;')
    os.system('cd touchscreen_electron && npm start')

def start_BLE():
    os.system('cd BLE_pollination/ && sudo node peripheral.js')

if __name__ == '__main__':
    #put thread functions in a list and loop through them
    threads = [threading.Thread(target=start_electron),
        threading.Thread(target=start_BLE)]
    for t in threads:
        # start thread
        t.start()