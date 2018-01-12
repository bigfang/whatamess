const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let mainWindow;

function createWindow() {
    var windowOptions = {
        width: 1080,
        minWidth: 680,
        height: 720,
        title: app.getName()
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.webContents.openDevTools();
    // BrowserWindow.addDevToolsExtension('./chrome');
    // BrowserWindow.removeDevToolsExtension('Vue.js devtools');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


const ipc = electron.ipcMain;
const dialog = electron.dialog;

ipc.on('save-dialog', function (event) {
    const options = {
        title: 'Save a config',
        filters: [
            { name: 'yaml文件', extensions: ['ymal'] }
        ]
    };
    dialog.showSaveDialog(options, function (filename) {
        event.sender.send('saved-file', filename);
    });
});
