import express from "express";
import AppController from "./controllers/App.controller.js";
import AdminController from "./controllers/auth/admin.controller.js";
import dashboardController from "./controllers/dashboard/dashboard.controller.js";
import CrfController from "./controllers/crf/crf.controller.js";
import ClientController from "./controllers/clients/clients.controller.js";
import ArquivosController from "./controllers/arquivos/arquivos.controller.js";
import AnexosController from "./controllers/anexos/anexos.controller.js";
import { upload, uploadAnexo } from "./middlewares/upload.js";

const Route = express.Router();

Route.get("/", (req, res) => {
  res.send("Seja bem vindo");
});

Route.get("/getconfig", AppController.getConfig);
Route.get("/getpassword", AdminController.getPassordAdmin);
Route.post("/saveconfig", AppController.saveConfig);
Route.put("/updateconfig", AppController.updateConfig);
Route.get("/getlogo", AppController.getLogo);
Route.post("/savelogo", upload.single("imagem"), AppController.saveLogo);
Route.post("/setpassword", AdminController.setPasswordAdmin);
Route.post("/loginadmin", AdminController.loginAdmin);
Route.get("/dashboard/stats", dashboardController.getStats);

// CRF Routes
Route.get("/crf", CrfController.getAll);
Route.get("/crf/:id", CrfController.getById);
Route.post("/crf", CrfController.create);
Route.put("/crf/:id", CrfController.update);
Route.delete("/crf/:id", CrfController.delete);

// Client Routes (Importadores)
Route.get("/clients", ClientController.getAll);
Route.get("/clients/:id", ClientController.getById);
Route.post("/clients", ClientController.create);
Route.put("/clients/:id", ClientController.update);
Route.delete("/clients/:id", ClientController.delete);

// Arquivos Routes
Route.get("/arquivos", ArquivosController.getAll);
Route.get("/arquivos/:id", ArquivosController.getById);
Route.post("/arquivos", ArquivosController.create);
Route.put("/arquivos/:id", ArquivosController.update);
Route.delete("/arquivos/:id", ArquivosController.delete);
Route.post("/arquivos/:id/emprestar", ArquivosController.emprestar);
Route.post("/arquivos/:id/devolver", ArquivosController.devolver);

// Anexos Routes
Route.get("/arquivos/:id/anexos", AnexosController.listByArquivoId);
Route.post(
  "/arquivos/:id/anexos",
  uploadAnexo.single("arquivo"),
  AnexosController.upload,
);
Route.delete("/anexos/:id", AnexosController.delete);
Route.get("/anexos/:id/download", AnexosController.download);

export { Route };
