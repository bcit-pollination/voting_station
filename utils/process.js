const { spawn } = require("child_process");

const blePollinationServerPath = "../BLE_pollination/app.js";
const adminExpressServerPath = "./servers/adminExpressServer.js";
const votingExpressServerPath = "./servers/votingExpressServer.js";

const processIDs = {
    bluetooth: -1,
    adminExpress: -1,
    votingExpress: -1
}

/**
 * Starts the bluetooth low energy server. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startBLEServerProcess() {
   
    console.log('Starting bluetooth low energy server');
    let BLEServerProcess = spawn("sudo", ["node", blePollinationServerPath]);

    // Get the pid of tthe bluetooth server
    processIDs.bluetooth = BLEServerProcess.pid
    
    // console.log(BLEServerProcess.pid)

    BLEServerProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    BLEServerProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });
    BLEServerProcess.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });
};

/**
 * Starts the voting express server used by electron app. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startVotingExpressServerProcess() {
    console.log('Starting voting express server');
    let votingExpresServerProcess = spawn("node", [votingExpressServerPath]);

    console.log("run-voting-server");

    votingExpresServerProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    votingExpresServerProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    votingExpresServerProcess.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });
};

/**
 * Starts the admin express server used by electron app. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startAdminExpressServerProcess() {
    console.log('Starting admin express server');
    let adminExpressServerProcess = spawn("node", [adminExpressServerPath]);

    console.log("run-admin-server");
    adminExpressServerProcess.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    adminExpressServerProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    adminExpressServerProcess.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });
};

function killBLEProcesses() {
    console.log('killBleProcesses:',processIDs.bluetooth)
    // let kill_node_processes_BLE = spawn("sudo", ["kill", processIDs.bluetooth]);
    let kill_node_processes_BLE = spawn('rfkill',['block','bluetooth']);


 
    

    kill_node_processes_BLE.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    

    kill_node_processes_BLE.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    kill_node_processes_BLE.on("close", (code) => {
        let kill_node_processes_BLE_2 = spawn('rfkill',['unblock','bluetooth']);
        // kill_node_processes_BLE_2.on("data", (data) => {
        //     console.log(`stdout: ${data}`);
        // });
        console.log(`child process exited with code: ${code}`);
    
    });
}

/**
 * Attempts to kill the admin, ble, and voting servers using the binded ports.
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function killProcesses() {

    
    killBLEProcesses()
    
    let kill_node_processes = spawn("fuser", ["-k", "3000/tcp"]);
    
    let kill_node_processes2 = spawn("fuser", ["-k", "4000/tcp"]);

    console.log("kill_node_processes");


    kill_node_processes.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    kill_node_processes.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    kill_node_processes.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });

    kill_node_processes2.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    kill_node_processes2.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });
}

module.exports = {
    startBLEServerProcess,
    startVotingExpressServerProcess,
    startAdminExpressServerProcess,
    killProcesses,
    killBLEProcesses
};