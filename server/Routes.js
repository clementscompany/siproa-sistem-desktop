import express from "express";
import AppController from "./controllers/App.controller.js";
const Route = express.Router();

Route.get("/", (req, res) => {
  res.send("Seja bem vindo");
});

Route.get("/getconfig", AppController.getConfig);
Route.post("/saveconfig", AppController.saveConfig);

export { Route };
