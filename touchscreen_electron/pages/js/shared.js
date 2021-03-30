const ipc = window.require("electron").ipcRenderer;

function showUsbs(port) {
    fetch(`http://localhost:${port}/usbs`)
        .then(response => response.json())
        .then(data => {
            data = JSON.parse(data);
            console.log(data);
            let usbsDiv = document.getElementById("usbs");
            usbsDiv.innerHTML = "";
            for (const usb of data.usbs) {
                if (usb.path == "/" || usb.path == "/boot/efi") continue; // HACK should not show these
                let div = document.createElement("div");
                let input = document.createElement("input");
                let label = document.createElement("label");
                input.setAttribute("type", "radio");
                input.setAttribute("id", usb.path);
                input.setAttribute("name", "usb");
                input.setAttribute("value", usb.path);
                input.setAttribute("class", "radio");
                input.checked = false;
                label.innerText = usb.path;
                div.appendChild(input);
                div.appendChild(label);
                usbsDiv.appendChild(div);
            }

        })
}

function goBack() {
    console.log("go back");
    ipc.send('go-back');
}

module.exports = {
    showUsbs,
    goBack
}