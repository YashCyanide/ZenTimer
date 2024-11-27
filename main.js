const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Function to create the main application window
function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true, // Ensure security
            nodeIntegration: false, // Disable Node.js integration
        },
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
    });

    win.loadFile('index.html');
}

// Handle system actions using IPC
ipcMain.handle('system-action', async (event, action) => {
    try {
        switch (action) {
            case 'shutdown':
                executeCommand(getShutdownCommand());
                break;
            case 'sleep':
                executeCommand(getSleepCommand());
                break;
            case 'motivate':
                shell.openExternal('https://youtu.be/tyB0ztf0DNY?si=q8McPsDcpn_rHHvR');
                break;
            case 'relax':
                shell.openExternal('https://youtube.com/playlist?list=PLbgVysG3YYf1vPn2OO1pNrJfHGQXydxX7&si=9XSDcj_Yh5_Vi5NN');
                break;
            default:
                console.error(`Unknown action: ${action}`);
        }
    } catch (error) {
        console.error(`Error handling action "${action}":`, error);
    }
});

// Get platform-specific shutdown command
function getShutdownCommand() {
    if (process.platform === 'win32') return 'shutdown /s /t 0';
    if (process.platform === 'darwin') return 'shutdown -h now';
    return 'systemctl poweroff';
}

// Get platform-specific sleep command
function getSleepCommand() {
    if (process.platform === 'win32') return 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0';
    if (process.platform === 'darwin') return 'pmset sleepnow';
    return 'systemctl suspend';
}

// Execute a system command with error handling
function executeCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${command}`, error);
        } else {
            console.log(`Command executed: ${command}`, stdout);
        }
    });
}

// App lifecycle
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
