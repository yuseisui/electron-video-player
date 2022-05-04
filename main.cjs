const process = require('process');
const {app, BrowserWindow} = require('electron');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    minWidth: 400,
    minHeight: 300,
    show: false,
    frame: false,
    backgroundColor: '#000',
  });

  win.loadFile('src/index.html');
  win.once('ready-to-show', () => {
    win.show();
  });

  // if (!app.isPackaged) {
  //   win.webContents.openDevTools({mode: 'undocked'});
  // }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
