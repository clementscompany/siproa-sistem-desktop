import ProcessosModule from "../../database/models/Processos.module.js";

class ProcessosController {
  async getAll(req, res) {
    try {
      const result = await ProcessosModule.getAll();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const result = await ProcessosModule.getById(req.params.id);
      if (!result) return res.status(404).json({ error: "Processo não encontrado" });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const result = await ProcessosModule.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const result = await ProcessosModule.update(req.params.id, req.body);
      if (result.affected === 0) return res.status(404).json({ error: "Processo não encontrado" });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await ProcessosModule.delete(req.params.id);
      if (result.affected === 0) return res.status(404).json({ error: "Processo não encontrado" });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new ProcessosController();
