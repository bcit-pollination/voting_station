const { spawn } = require("child_process");

/**
 * Starts the bluetooth low energy server. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
const startBLEServerProcess = () => {
    let BLE_server_process = spawn("sudo", ["node", "../BLE_pollination/app.js"]);
    console.log(BLE_server_process);
    BLE_server_process.pid;

    BLE_server_process.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });
    BLE_server_process.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });
    BLE_server_process.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });
};

/**
 * Starts the voting express server used by. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
const votingExpressServerProcess = () => {
    let voting_express_server_process = spawn("node", [
        "./servers/voting_express_server.js",
    ]);

    console.log("run-voting-server");

    voting_express_server_process.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    voting_express_server_process.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    voting_express_server_process.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });
};

module.exports = {
    start_BLE_server_process: startBLEServerProcess,
    voting_express_server_process: votingExpressServerProcess,
};