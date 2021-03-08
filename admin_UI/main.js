// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { exec, spawn } = require('child_process');

//import ipc utils
const ipc = require('electron').ipcMain;
const { webContents } = require('electron')



const voting_express_server_process = () => {
  let voting_express_server_process = spawn('node', ['./servers/voting_express_server.js']);

  console.log('run-voting-server')
    
  voting_express_server_process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  voting_express_server_process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  voting_express_server_process.on('close', (code) => {
    console.log(`child process exited with code: ${code}`);
  });

}

const admin_express_server_process = () => {
  let admin_express_server_process = spawn('node', ['./servers/admin_express_server.js']);

  console.log('run-admin-server')
  admin_express_server_process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  admin_express_server_process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  admin_express_server_process.on('close', (code) => {
    console.log(`child process exited with code: ${code}`);
  });
}


const exit_node_servers = () => {
  exec('sudo bash ./kill_node_processes.sh', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}

// used as a global access
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration : true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


  //webContents sends a message to ipcRenderer
  ipc.on('run-voting-server', () => {
    voting_express_server_process()
  })

  //webContents sends a message to ipcRenderer
  ipc.on('run-admin-server', () => {
    admin_express_server_process()
  })












})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  exit_node_servers();
  if (process.platform !== 'darwin') app.quit()

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
