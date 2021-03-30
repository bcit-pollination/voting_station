const ipc = window.require("electron").ipcRenderer;


function goBack() {
    console.log("go back");
    ipc.send('go-back');
}

module.exports = {
    showUsbs,
    goBack
}