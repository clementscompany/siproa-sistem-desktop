import express from "express";
import AppController from "./controllers/App.controller.js";
import AdminController from "./controllers/auth/admin.controller.js";
import dashboardController from "./controllers/dashboard/dashboard.controller.js";
import CrfController from "./controllers/crf/crf.controller.js";
import ClientController from "./controllers/clients/clients.controller.js";
import ArquivosController from "./controllers/arquivos/arquivos.controller.js";
import AnexosController from "./controllers/anexos/anexos.controller.js";
import ProcessosController from "./controllers/processos/processos.controller.js";
import EstanciaController from "./controllers/estancias.controller.js";
import CodExportadorController from "./controllers/cod_exportador.controller.js";
import IneExportadorController from "./controllers/ine_exportador.controller.js";
import MoradaExportadorController from "./controllers/morada_exportador.controller.js";
import BancosController from "./controllers/bancos/bancos.controller.js";
import FormasPagamentoController from "./controllers/formas_pagamento/formas_pagamento.controller.js";
import MeioTransporteController from "./controllers/meio_transporte/meio_transporte.controller.js";
import RegimeController from "./controllers/regimes/regime.controller.js";
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

// Processos Routes
Route.get("/processos", ProcessosController.getAll);
Route.get("/processos/:id", ProcessosController.getById);
Route.post("/processos", ProcessosController.create);
Route.put("/processos/:id", ProcessosController.update);
Route.delete("/processos/:id", ProcessosController.delete);

// Bancos Routes
Route.get("/bancos", BancosController.getAll);
Route.get("/bancos/:id", BancosController.getById);
Route.post("/bancos", BancosController.create);
Route.put("/bancos/:id", BancosController.update);
Route.delete("/bancos/:id", BancosController.delete);

// Formas de Pagamento Routes
Route.get("/formas-pagamento", FormasPagamentoController.getAll);
Route.get("/formas-pagamento/:id", FormasPagamentoController.getById);
Route.post("/formas-pagamento", FormasPagamentoController.create);
Route.put("/formas-pagamento/:id", FormasPagamentoController.update);
Route.delete("/formas-pagamento/:id", FormasPagamentoController.delete);

// Meios de Transporte Routes
Route.get("/meios-transporte", MeioTransporteController.getAll);
Route.get("/meios-transporte/:id", MeioTransporteController.getById);
Route.post("/meios-transporte", MeioTransporteController.create);
Route.put("/meios-transporte/:id", MeioTransporteController.update);
Route.delete("/meios-transporte/:id", MeioTransporteController.delete);

// Regimes Routes
Route.get("/regimes", RegimeController.getAll);
Route.get("/regimes/:id", RegimeController.getById);
Route.post("/regimes", RegimeController.create);
Route.put("/regimes/:id", RegimeController.update);
Route.delete("/regimes/:id", RegimeController.delete);

// Estâncias Routes
Route.get("/estancias", EstanciaController.getAll);
Route.get("/estancias/:id", EstanciaController.getById);
Route.post("/estancias", EstanciaController.create);
Route.put("/estancias/:id", EstanciaController.update);
Route.delete("/estancias/:id", EstanciaController.delete);

// Códigos de Exportador Routes
Route.get("/cod-exportador", CodExportadorController.getAll);
Route.get("/cod-exportador/:id", CodExportadorController.getById);
Route.post("/cod-exportador", CodExportadorController.create);
Route.put("/cod-exportador/:id", CodExportadorController.update);
Route.delete("/cod-exportador/:id", CodExportadorController.delete);

// INE de Exportador Routes
Route.get("/ine-exportador", IneExportadorController.getAll);
Route.get("/ine-exportador/:id", IneExportadorController.getById);
Route.post("/ine-exportador", IneExportadorController.create);
Route.put("/ine-exportador/:id", IneExportadorController.update);
Route.delete("/ine-exportador/:id", IneExportadorController.delete);

// Morada de Exportador Routes
Route.get("/morada-exportador", MoradaExportadorController.getAll);
Route.get("/morada-exportador/:id", MoradaExportadorController.getById);
Route.post("/morada-exportador", MoradaExportadorController.create);
Route.put("/morada-exportador/:id", MoradaExportadorController.update);
Route.delete("/morada-exportador/:id", MoradaExportadorController.delete);

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
