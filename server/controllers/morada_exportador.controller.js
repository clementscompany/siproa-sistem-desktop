import MoradaExportadorModule from "../database/models/MoradaExportador.module.js";

class MoradaExportadorController {
  async getAll(req, res) {
    try {
      const data = await MoradaExportadorModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Moradas de Exportador" });
    }
  }

  async getById(req, res) {
    try {
      const data = await MoradaExportadorModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Morada de Exportador não encontrada" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Morada de Exportador" });
    }
  }

  async create(req, res) {
    try {
      const result = await MoradaExportadorModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar Morada de Exportador" });
    }
  }

  async update(req, res) {
    try {
      const result = await MoradaExportadorModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Morada de Exportador" });
    }
  }

  async delete(req, res) {
    try {
      const result = await MoradaExportadorModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Morada de Exportador" });
    }
  }
}

export default new MoradaExportadorController();
