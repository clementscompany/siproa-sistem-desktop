import BancosModule from "../../database/models/Bancos.module.js";

class BancosController {
  async getAll(req, res) {
    try {
      console.log("[BancosController] Buscando todos os bancos...");
      const data = await BancosModule.getAll();
      console.log("[BancosController] Dados encontrados:", data);
      res.json(data);
    } catch (error) {
      console.error("[BancosController] Erro ao buscar bancos:", error);
      res.status(500).json({ error: "Erro ao buscar Bancos" });
    }
  }

  async getById(req, res) {
    try {
      const data = await BancosModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Banco não encontrado" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Banco" });
    }
  }

  async create(req, res) {
    try {
      console.log("[BancosController] Criando banco com dados:", req.body);
      const result = await BancosModule.create(req.body);
      console.log("[BancosController] Banco criado com sucesso:", result);
      res.status(201).json(result);
    } catch (error) {
      console.error("[BancosController] Erro ao criar banco:", error);
      res.status(500).json({ error: "Erro ao criar Banco" });
    }
  }

  async update(req, res) {
    try {
      const result = await BancosModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Banco" });
    }
  }

  async delete(req, res) {
    try {
      const result = await BancosModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Banco" });
    }
  }
}

export default new BancosController();
