const { exec, spawn } = require('child_process');


const start_load_question_process = () => {
    let load_question_process = spawn('sudo', ['node','../code examples/mongoDB_tasks/March_10.js']);
    load_question_process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    load_question_process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    load_question_process.on('close', (code) => {
      console.log(`child process exited with code: ${code}`);
    });
  }
  
  const start_BLE_server_process = ()=>{
    let BLE_server_process = spawn('sudo', ['node','../BLE_pollination/peripheral.js']);
    BLE_server_process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    BLE_server_process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    BLE_server_process.on('close', (code) => {
      console.log(`child process exited with code: ${code}`);
    });
  
  }
  
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

  module.exports = {
    start_load_question_process,
    start_BLE_server_process,
    voting_express_server_process,
  }