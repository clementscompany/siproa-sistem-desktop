import MeioTransporteModule from "../../database/models/MeioTransporte.module.js";

class MeioTransporteController {
  async getAll(req, res) {
    try {
      const data = await MeioTransporteModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Meios de Transporte" });
    }
  }

  async getById(req, res) {
    try {
      const data = await MeioTransporteModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Meio de Transporte não encontrado" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Meio de Transporte" });
    }
  }

  async create(req, res) {
    try {
      const result = await MeioTransporteModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar Meio de Transporte" });
    }
  }

  async update(req, res) {
    try {
      const result = await MeioTransporteModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Meio de Transporte" });
    }
  }

  async delete(req, res) {
    try {
      const result = await MeioTransporteModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Meio de Transporte" });
    }
  }
}

export default new MeioTransporteController();
