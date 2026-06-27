import multer from "multer";
import path from "path";
import fs from "fs";

/* =========================
   DIRETÓRIO BASE
========================= */
const uploadDir = process.env.SIPROA_UPLOAD_DIR
  ? path.resolve(process.env.SIPROA_UPLOAD_DIR)
  : path.resolve("server/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* =========================
   STORAGE IMAGENS (LOGO / GERAL)
========================= */
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(uploadDir, "images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "img-" + uniqueSuffix + ext);
  },
});

/* =========================
   STORAGE ANEXOS
========================= */
const anexoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const arquivoId = req.params?.id ?? req.body?.arquivo_id ?? "geral";

    const dir = path.join(uploadDir, "arquivos", String(arquivoId));

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "anexo-" + uniqueSuffix + ext);
  },
});

/* =========================
   STORAGE BACKUP (JSON)
========================= */
const backupStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(uploadDir, "backups");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, "backup-" + uniqueSuffix + ".json");
  },
});

/* =========================
   FILE FILTERS
========================= */

/* IMAGENS */
const imageFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/json",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Apenas imagens são permitidas"), false);
  }
};

/* BACKUP JSON */
const backupFilter = (req, file, cb) => {
  const allowedTypes = ["application/json"];

  const isJson =
    file.mimetype === "application/json" || file.originalname.endsWith(".json");

  if (allowedTypes.includes(file.mimetype) || isJson) {
    cb(null, true);
  } else {
    cb(new Error("Apenas ficheiros JSON são permitidos"), false);
  }
};

/* =========================
   UPLOADS EXPORTADOS
========================= */

/* IMAGEM (LOGO / GERAL) */
export const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter,
});

/* ANEXOS */
export const uploadAnexo = multer({
  storage: anexoStorage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

/* BACKUP */
export const uploadBackup = multer({
  storage: backupStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: backupFilter,
});
