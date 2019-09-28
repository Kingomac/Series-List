//Require Electron
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

//Require my modules (to avoid making spaguetthi)
const templateMenu = require('./modules/templateMenu');

if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  })
}

let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    minWidth: 795,
    minHeight: 700,
    resizable: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    show: false
  });
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes: true
  }))
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const mainMenu = Menu.buildFromTemplate(templateMenu.template);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on('closed', () => {
    app.quit();
  });
});

//Check platform to set menu for Mac and check if it's production
templateMenu.checkPlatform();