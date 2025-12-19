import CrfModule from "../../database/models/Crf.module.js";

class CrfController {
  async getAll(req, res) {
    try {
      const data = await CrfModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar CRFs" });
    }
  }

  async create(req, res) {
    try {
      console.log(
        "Dados recebidos para CRF:",
        JSON.stringify(req.body, null, 2),
      );
      const result = await CrfModule.create(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Erro detalhado ao criar CRF:", error);
      res.status(500).json({
        error: error.message || "Erro ao criar CRF",
        details: error.toString(),
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await CrfModule.getById(id);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar CRF" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await CrfModule.update(id, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar CRF" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await CrfModule.delete(id);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao eliminar CRF" });
    }
  }
}

export default new CrfController();
