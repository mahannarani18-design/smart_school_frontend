const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process'); // برای اجرای فرآیندهای خارجی

let djangoProcess = null;

function createWindow() {
  // اجرای سرور جنگو در پس‌زمینه
  if (isDev) {
    // در حالت توسعه، از سرور عادی جنگو استفاده می‌کنیم
    djangoProcess = spawn('python', ['../backend/manage.py', 'runserver', '8000']);
  } else {
    // در نسخه نهایی، فایل اجرایی بک‌اند را اجرا می‌کنیم (بعداً ساخته می‌شود)
    // djangoProcess = spawn(path.join(__dirname, '../backend_dist/manage.exe'));
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // قبل از بستن برنامه، فرآیند جنگو را متوقف می‌کنیم
    if (djangoProcess) {
      djangoProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});