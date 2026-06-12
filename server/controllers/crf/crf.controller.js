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

      const result = await CrfModule.create(req.body);
      res.status(201).json(result);
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
      console.log("Dados recebidos para criação de CRF:", req.body);
      if (!result || result.affected === 0) {
        return res.status(404).json({ error: "CRF não encontrada" });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar CRF" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await CrfModule.delete(id);
      if (!result || result.affected === 0) {
        return res.status(404).json({ error: "CRF não encontrada" });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao eliminar CRF" });
    }
  }
}

export default new CrfController();
