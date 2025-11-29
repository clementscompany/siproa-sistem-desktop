import express from "express";
import cors from "cors";
import { Route } from "./Routes.js";

const Server = express();
const port = 5000;

// Middlewares globais
Server.use(express.json());
Server.use(express.urlencoded({ extended: true }));
Server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH"],
  }),
);

Server.use(Route);
export { Server };
