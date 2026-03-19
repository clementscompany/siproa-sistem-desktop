import ArquivosModule from "../../database/models/Arquivos.module.js";

const isBadRequest = (error) => {
  const msg = String(error?.message || "");
  return (
    msg.includes("inválid") ||
    msg.includes("obrigat") ||
    msg.includes("não pode") ||
    msg.includes("nao pode")
  );
};

class ArquivosController {
  async getAll(req, res) {
    try {
      const data = await ArquivosModule.getAll(req.query);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Arquivos" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await ArquivosModule.getById(id);
      if (!data) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Arquivo" });
    }
  }

  async create(req, res) {
    try {
      const result = await ArquivosModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      if (isBadRequest(error)) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro ao criar Arquivo" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await ArquivosModule.update(id, req.body);
      if (!result || result.affected === 0) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      if (isBadRequest(error)) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro ao atualizar Arquivo" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ArquivosModule.delete(id);
      if (!result || result.affected === 0) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao eliminar Arquivo" });
    }
  }

  async emprestar(req, res) {
    try {
      const { id } = req.params;
      const result = await ArquivosModule.emprestar(id);
      if (!result || result.affected === 0) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao emprestar Arquivo" });
    }
  }

  async devolver(req, res) {
    try {
      const { id } = req.params;
      const result = await ArquivosModule.devolver(id);
      if (!result || result.affected === 0) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao devolver Arquivo" });
    }
  }
}

export default new ArquivosController();
