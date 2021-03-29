// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec, spawn } = require("child_process");

const { connectMongoose } = require("../utils/mongo/mongoHandler");

// import ipc utils
const ipc = require("electron").ipcMain;

// this sends
const { webContents } = require("electron");

const { startAdminExpressServerProcess } = require("../utils/startProcess");

const { getElectionsList, login } = require("../utils/pollinationAPI");

const { startBLEServerProcess, startVotingExpressServerProcess } = require("../utils/startProcess");

// Connect to local mongoose, if and error occurs not much else will work
connectMongoose();

const bluetooth_off_and_on = async() => {
    await spawn("rfkill", ["block", "bluetooth"]);
    return await spawn("rfkill", ["unblock", "bluetooth"]);
};

const exit_node_servers = () => {
    spawn("fuser", ["-k", "3000/tcp"]);
    spawn("fuser", ["-k", "4000/tcp"]);

    bluetooth_off_and_on();

    return new Promise(async(resolve, reject) => {
        // kill possible express servers
        let kill_node_processes = await spawn("fuser", ["-k", "3000/tcp"]);
        let kill_node_processes2 = await spawn("fuser", ["-k", "4000/tcp"]);
        console.log("kill_node_processes");

        kill_node_processes.stdout.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        kill_node_processes.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        // let both_done = false

        // kill_node_processes.on('close', (code) => {

        //   if (code!=0) {
        //     resolve(code)
        //   }
        //   resolve('exec success')
        // });

        kill_node_processes2.on("close", (code) => {
            if (code != 0) {
                resolve(code);
            }

            resolve("exec success");
        });
    });
};

// used as a global access
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            //Important:
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js"),
            // nodeIntegration : true
        },
    });

    // and load the index.html of the app.
    mainWindow.loadFile("index.html");

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on("activate", function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    //webContents sends a message to ipcRenderer
    ipc.on("run-voting-server", () => {
        startVotingExpressServerProcess();
        mainWindow.loadFile("./pages/html/voting.html");
    });

    //webContents sends a message to ipcRenderer
    ipc.on("upload-results", () => {
        console.log("uploading......");
        console.log("upload successful!");
    });

    //webContents sends a message to ipcRenderer
    ipc.on("run-admin-server", () => {
        startAdminExpressServerProcess();
        // load the index.html of the app.
        mainWindow.loadFile("./pages/html/admin.html");
    });

    ipc.on("start-BLE-server", () => {
        startBLEServerProcess();
    });

    // ipc.on('load-questions', () => {
    //   start_load_question_process()
    // })

    ipc.on("kill-processes", () => {
        let kill_node_processes_BLE = spawn("fuser", ["-k", "5000/tcp"]);
        let kill_node_processes = spawn("fuser", ["-k", "3000/tcp"]);
        let kill_node_processes2 = spawn("fuser", ["-k", "4000/tcp"]);

        console.log("kill_node_processes");

        kill_node_processes_BLE.on("data", (data) => {
            console.log(`stdout: ${data}`);
        });

        kill_node_processes_BLE.stderr.on("data", (data) => {
            console.error(`stderr: ${data}`);
        });

        kill_node_processes_BLE.on("close", (code) => {
            console.log(`child process exited with code: ${code}`);
        });

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
    });

    // Go Back
    // ipc.on("go-back", () => {
    //     mainWindow.webContents.goBack();
    //     console.log("IPC clicked: go-back");
    // });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function() {
    let p = new Promise(async(resolve, reject) => {
        let res = await exit_node_servers();
        console.log("checkedItems in MultiChoice");
        // console.log(choices)
        resolve(res);
    });
    p.then((r) => {
        console.log(r);
        if (process.platform !== "darwin") app.quit();
    });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.