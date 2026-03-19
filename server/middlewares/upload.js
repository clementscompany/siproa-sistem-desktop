import multer from "multer";
import path from "path";
import fs from "fs";

// Garantir que o diretório de uploads existe
const uploadDir = process.env.SIPROA_UPLOAD_DIR
  ? path.resolve(process.env.SIPROA_UPLOAD_DIR)
  : path.resolve("server/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "logo-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo inválido. Apenas imagens são permitidas."), false);
  }
};

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

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

export const uploadAnexo = multer({
  storage: anexoStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
});
