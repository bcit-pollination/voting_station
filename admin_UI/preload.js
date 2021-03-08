// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const ipc = require('electron').ipcRenderer;

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  document.getElementById('start-process-1').addEventListener('click',()=>{
    console.log('run-admin-server')
    ipc.send('run-admin-server', 'A sync message to main');
  })
  
  document.getElementById('start-process-2').addEventListener('click',()=>{
    console.log('run-voting-server')
    ipc.send('run-voting-server', 'A sync message to main');
  })
})




