const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() =>  {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/icon.png')
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
})
