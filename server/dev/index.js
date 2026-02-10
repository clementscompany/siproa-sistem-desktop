import express from "express";
import cors from "cors";
import { Route } from "../Routes.js";
import { CreateTable } from "../database/db.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const port = 5001;

// Middlewares globais
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// Configurar pasta estática para uploads
const uploadDir = process.env.SIPROA_UPLOAD_DIR
  ? path.resolve(process.env.SIPROA_UPLOAD_DIR)
  : path.resolve("server/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

server.use(
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

// Usar rotas
server.use(Route);
CreateTable();

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
