import express from "express";
import AppController from "./controllers/App.controller.js";
import AdminController from "./controllers/auth/admin.controller.js";
const Route = express.Router();

Route.get("/", (req, res) => {
  res.send("Seja bem vindo");
});

Route.get("/getconfig", AppController.getConfig);
Route.get("/getpassword", AdminController.getPassordAdmin);
Route.post("/saveconfig", AppController.saveConfig);
Route.post("/setpassword", AdminController.setPasswordAdmin);

export { Route };
