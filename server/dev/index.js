import express from "express";
import cors from "cors";
import { Route } from "../Routes.js";
import { CreateTable } from "../database/db.js";

const server = express();
const port = 5001;

// Middlewares globais
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// Usar rotas
server.use(Route);
CreateTable();

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
