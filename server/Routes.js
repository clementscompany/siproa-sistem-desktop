import express from "express";
import AppController from "./controllers/App.controller.js";
import AdminController from "./controllers/auth/admin.controller.js";
import dashboardController from "./controllers/dashboard/dashboard.controller.js";
import CrfController from "./controllers/crf/crf.controller.js";
import ClientController from "./controllers/clients/clients.controller.js";
import { upload } from "./middlewares/upload.js";

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

export { Route };
