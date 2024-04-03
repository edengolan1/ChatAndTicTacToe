import { app, BrowserWindow } from 'electron';

const isMac = process.platform === 'darwin';

function createWindow() {
    const mainWindow = new BrowserWindow({
        title: 'TalkBack',
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
        }
    });

    mainWindow.loadURL('http://localhost:5173');
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', function () {
    if (!isMac) {
        app.quit();
    }
});
