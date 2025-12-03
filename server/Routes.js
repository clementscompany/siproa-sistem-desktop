import express from "express";
import AppController from "./controllers/App.controller.js";
import AdminController from "./controllers/auth/admin.controller.js";
import dashboardController from "./controllers/dashboard/dashboard.controller.js";

const Route = express.Router();

Route.get("/", (req, res) => {
  res.send("Seja bem vindo");
});

Route.get("/getconfig", AppController.getConfig);
Route.get("/getpassword", AdminController.getPassordAdmin);
Route.post("/saveconfig", AppController.saveConfig);
Route.post("/setpassword", AdminController.setPasswordAdmin);
Route.post("/loginadmin", AdminController.loginAdmin);
Route.get("/dashboard/stats", dashboardController.getStats);
export { Route };
