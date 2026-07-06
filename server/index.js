import express from "express";
import cors from "cors";
import { Route } from "./Routes.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Server = express();
const port = 5000;

// Middlewares globais
Server.use(express.json({ limit: "50mb" }));
Server.use(express.urlencoded({ limit: "50mb", extended: true }));
Server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// Diretório de uploads
const uploadDir = process.env.SIPROA_UPLOAD_DIR
  ? path.resolve(process.env.SIPROA_UPLOAD_DIR)
  : path.join(__dirname, "uploads");

// Garantir que a estrutura exista
fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(path.join(uploadDir, "images"), { recursive: true });

// Servir arquivos estáticos
Server.use(
  "/uploads",
  express.static(uploadDir, {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      );
    },
  }),
);

// Rotas
Server.use(Route);

export { Server, uploadDir };
