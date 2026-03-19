import fs from "fs";
import path from "path";
import AnexosModule from "../../database/models/Anexos.module.js";
import ArquivosModule from "../../database/models/Arquivos.module.js";

const getUploadDir = () =>
  process.env.SIPROA_UPLOAD_DIR
    ? path.resolve(process.env.SIPROA_UPLOAD_DIR)
    : path.resolve("server/uploads");

const resolveSafeUploadPath = (relativePath) => {
  const base = getUploadDir();
  const resolved = path.resolve(base, relativePath);
  const baseWithSep = base.endsWith(path.sep) ? base : base + path.sep;
  if (!resolved.toLowerCase().startsWith(baseWithSep.toLowerCase())) {
    return null;
  }
  return resolved;
};

class AnexosController {
  async listByArquivoId(req, res) {
    try {
      const { id } = req.params;
      const anexos = await AnexosModule.listByArquivoId(id);
      res.json(anexos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Anexos" });
    }
  }

  async upload(req, res) {
    try {
      const { id } = req.params;
      const arquivo = await ArquivosModule.getById(id);
      if (!arquivo) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      const uploadDir = getUploadDir();
      const relative = path.relative(uploadDir, req.file.path).split(path.sep).join("/");

      const created = await AnexosModule.create({
        arquivo_id: Number(id),
        nome_do_arquivo: req.file.originalname,
        tipo_de_arquivo: req.file.mimetype,
        caminho_do_arquivo: relative,
        tamanho_bytes: req.file.size,
      });

      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao enviar Anexo" });
    }
  }

  async download(req, res) {
    try {
      const { id } = req.params;
      const anexo = await AnexosModule.getById(id);
      if (!anexo) {
        return res.status(404).json({ error: "Anexo não encontrado" });
      }

      const absPath = resolveSafeUploadPath(anexo.caminho_do_arquivo);
      if (!absPath) {
        return res.status(400).json({ error: "Caminho inválido" });
      }
      if (!fs.existsSync(absPath)) {
        return res.status(404).json({ error: "Arquivo físico não encontrado" });
      }

      res.download(absPath, anexo.nome_do_arquivo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao baixar Anexo" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const anexo = await AnexosModule.getById(id);
      if (!anexo) {
        return res.status(404).json({ error: "Anexo não encontrado" });
      }

      const absPath = resolveSafeUploadPath(anexo.caminho_do_arquivo);
      if (!absPath) {
        return res.status(400).json({ error: "Caminho inválido" });
      }

      try {
        fs.unlinkSync(absPath);
      } catch (e) {
        if (e?.code !== "ENOENT") {
          throw e;
        }
      }

      const result = await AnexosModule.delete(id);
      if (!result || result.affected === 0) {
        return res.status(404).json({ error: "Anexo não encontrado" });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao eliminar Anexo" });
    }
  }
}

export default new AnexosController();
