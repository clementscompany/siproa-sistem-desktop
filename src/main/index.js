import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

let mainWindow;
let serverStarted = false;
let serverApp;

function createWindow() {
  mainWindow = new BrowserWindow({
    titleBarStyle: "hiddenInset",
    width: 1300,
    height: 700,
    minWidth: 1000,
    minHeight: 600,
    thickFrame: true,
    icon,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      // preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // DEV → servidor Vite
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } 
  // PROD → arquivo local
  else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// 🔥 INICIAR SERVIDOR BACKEND JUNTO COM O ELECTRON
async function startServer() {
  if (serverStarted) return;

  if (!process.env.SIPROA_UPLOAD_DIR) {
    process.env.SIPROA_UPLOAD_DIR = join(app.getPath("userData"), "uploads");
  }

  const { Server } = await import("../../server/index.js");
  serverApp = Server;

  serverApp.listen(5000, () => {
    console.log("Servidor SIPROA rodando em:", "http://localhost:5000");
    serverStarted = true;
  });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.siproa.desktop");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on("ping", () => console.log("pong"));

  // 🔥 ORDEM CORRETA
  startServer().then(() => {
    createWindow(); // depois abre frontend
  });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
