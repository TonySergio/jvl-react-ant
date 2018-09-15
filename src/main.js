const path = require('path');
const url = require('url');
const { app, crashReporter, BrowserWindow, Menu } = require('electron');

const isDevelopment = process.env.NODE_ENV === 'development';

console.log('isDevelopment=', isDevelopment);

const APP_NAME = isDevelopment ? 'SAS Test Tool (development)' : 'SAS Test Tool';

let mainWindow = null;
let forceQuit = false;

// const installExtensions = async () => {
//   const installer = require('electron-devtools-installer');
//   const extensions = ['REACT_DEVELOPER_TOOLS'];
//   const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
//   for (const name of extensions) {
//     try {
//       await installer.default(installer[name], forceDownload);
//     } catch (e) {
//       console.log(`Error installing ${name} extension: ${e.message}`);
//     }
//   }
// };

crashReporter.start({
  productName: 'SAS Test Tool',
  companyName: 'JVL Inc',
  submitURL: 'https://your-domain.com/url-to-submit',
  uploadToServer: false,
});

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  // if (isDevelopment) {
  //   await installExtensions();
  // }

  mainWindow = new BrowserWindow({
    title: APP_NAME,
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    show: false,
  });

  mainWindow.maximize();

  if (isDevelopment) {
    console.log(`dev port: ${process.env.PORT}`);

    mainWindow.loadURL(
      url.format({
        protocol: 'http:',
        pathname: `localhost:${process.env.PORT || 8000}`,
        // TODO: correct common use - port: `${process.env.PORT || 8000}`,
        slashes: true,
      })
    );
  } else {
    console.log('DIR_NAME: ', __dirname);

    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      mainWindow.on('close', function(e) {
        if (!forceQuit) {
          e.preventDefault();
          mainWindow.hide();
        }
      });

      app.on('activate', () => {
        mainWindow.show();
      });

      app.on('before-quit', () => {
        forceQuit = true;
      });
    } else {
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    }
  });

  if (isDevelopment) {
    // auto-open dev tools
    // mainWindow.webContents.openDevTools();

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y);
          },
        },
      ]).popup(mainWindow);
    });
  }
});
