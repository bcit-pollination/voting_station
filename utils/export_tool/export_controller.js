const { spawn } = require('child_process');

const runUsbFetcher = async() => {
    let spawnOutput = "";

    const python = spawn('python3', ['../utils/export_tool/usb_fetcher.py']);

    python.stdout.on('data', function(data) {
        console.log('Received output from usb_fetcher.py');
        spawnOutput = data.toString();
    });

    return new Promise((resolve, reject) => {
        python.once('exit', (code, string) => {
            if (code === 0) {
                resolve(spawnOutput);
            } else {
                reject(new Error('Exit with error code: ' + code));
            }
        });
        python.once('error', (err) => {
            reject(err);
        });
    });
}

const runExport = async(data, key, dest_path) => {
    let spawnOutput = "";

    const pyFile = '../utils/export_tool/export.py';
    const args = [data, key, dest_path];
    args.unshift(pyFile);
    const python = spawn('python3', args);
    python.stdout.on('data', function(data) {

        spawnOutput = data.toString();
    });

    return new Promise((resolve, reject) => {
        python.once('exit', (code, string) => {
            if (code === 0) {
                resolve(spawnOutput);
            } else {
                reject(new Error('Exit with error code: ' + code));
            }
        });
        python.once('error', (err) => {
            reject(err);
        });
    });
}

const runImport = async(key, input_data_path) => {
        let spawnOutput = "";

        const pyFile = '../utils/export_tool/import.py';
        const args = [key, input_data_path];
        args.unshift(pyFile);
        const python = spawn('python3', args);
        python.stdout.on('data', function(data) {

            console.log('Received output from decode.py');

            spawnOutput = data.toString();
            console.log(spawnOutput);
        });


        return new Promise((resolve, reject) => {
            python.once('exit', (code, string) => {
                if (code === 0) {
                    resolve(spawnOutput);
                } else {
                    reject(new Error('Exit with error code: ' + code));
                }
            });
            python.once('error', (err) => {
                reject(err);
            });
        });

    }
    // runImport("./testing.key", "./").then((data) => {
    //   console.log(data);
    // }).catch((e) => console.log(e));

exports.runImport = runImport;
exports.runUsbFetcher = runUsbFetcher;
exports.runExport = runExport;