import IneExportadorModule from "../database/models/IneExportador.module.js";

class IneExportadorController {
  async getAll(req, res) {
    try {
      const data = await IneExportadorModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar INEs de Exportador" });
    }
  }

  async getById(req, res) {
    try {
      const data = await IneExportadorModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "INE de Exportador não encontrado" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar INE de Exportador" });
    }
  }

  async create(req, res) {
    try {
      const result = await IneExportadorModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar INE de Exportador" });
    }
  }

  async update(req, res) {
    try {
      const result = await IneExportadorModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar INE de Exportador" });
    }
  }

  async delete(req, res) {
    try {
      const result = await IneExportadorModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar INE de Exportador" });
    }
  }
}

export default new IneExportadorController();
