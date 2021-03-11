// import ipc utils
const ipc = require('electron').ipcMain;
const { spawn } = require('child_process');

const central_pi_express_server_js_route = './servers/admin_express_server.js'


const admin_express_server_process = () => {
    let admin_express_server_process = spawn('node', [central_pi_express_server_js_route]);
  
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

module.exports={
    admin_express_server_process,
}

