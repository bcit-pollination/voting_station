const { spawn } = require("child_process");

const blePollinationServerPath = "./BLE_pollination/app.js";
const adminExpressServerPath = "./servers/admin_express_server.js";
const votingExpressServerPath = "./touchscreen_electron/servers/voting_express_server.js";

/**
 * Starts the bluetooth low energy server. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startBLEServerProcess() {
    console.log('Starting bluetooth low energy server');
    let BLE_server_process = spawn("sudo", ["node", blePollinationServerPath]);
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
 * Starts the voting express server used by electron app. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startVotingExpressServerProcess() {
    console.log('Starting voting express server');
    let voting_express_server_process = spawn("node", [votingExpressServerPath]);

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

/**
 * Starts the admin express server used by electron app. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startAdminExpressServerProcess() {
    console.log('Starting admin express server');
    let admin_express_server_process = spawn("node", [adminExpressServerPath]);

    console.log("run-admin-server");
    admin_express_server_process.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    admin_express_server_process.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    admin_express_server_process.on("close", (code) => {
        console.log(`child process exited with code: ${code}`);
    });
};

module.exports = {
    startBLEServerProcess,
    startVotingExpressServerProcess,
    startAdminExpressServerProcess
};