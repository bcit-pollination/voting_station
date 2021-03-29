const { spawn } = require("child_process");

/**
 * Starts the bluetooth low energy server. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startBLEServerProcess() {
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
 * Starts the voting express server used by electron app. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startVotingExpressServerProcess() {
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

/**
 * Starts the admin express server used by electron app. 
 * 
 * Sets standard out and err of the new process to the current process's standard descriptors. Also
 * maps on 'close' event to log exit code.
 */
function startAdminExpressServerProcess() {
    let admin_express_server_process = spawn("node", [
        central_pi_express_server_js_route,
    ]);

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