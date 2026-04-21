import RegimeModule from "../../database/models/Regime.module.js";

class RegimeController {
  async getAll(req, res) {
    try {
      const data = await RegimeModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Regimes" });
    }
  }

  async getById(req, res) {
    try {
      const data = await RegimeModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Regime não encontrado" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Regime" });
    }
  }

  async create(req, res) {
    try {
      const result = await RegimeModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar Regime" });
    }
  }

  async update(req, res) {
    try {
      const result = await RegimeModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Regime" });
    }
  }

  async delete(req, res) {
    try {
      const result = await RegimeModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Regime" });
    }
  }
}

export default new RegimeController();
