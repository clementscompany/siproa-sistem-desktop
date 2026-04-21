import CodExportadorModule from "../database/models/CodExportador.module.js";

class CodExportadorController {
  async getAll(req, res) {
    try {
      const data = await CodExportadorModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Códigos de Exportador" });
    }
  }

  async getById(req, res) {
    try {
      const data = await CodExportadorModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Código de Exportador não encontrado" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Código de Exportador" });
    }
  }

  async create(req, res) {
    try {
      const result = await CodExportadorModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar Código de Exportador" });
    }
  }

  async update(req, res) {
    try {
      const result = await CodExportadorModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Código de Exportador" });
    }
  }

  async delete(req, res) {
    try {
      const result = await CodExportadorModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Código de Exportador" });
    }
  }
}

export default new CodExportadorController();
