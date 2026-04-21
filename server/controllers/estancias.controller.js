import EstanciaModule from "../database/models/Estancia.module.js";

class EstanciaController {
  async getAll(req, res) {
    try {
      const data = await EstanciaModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Estâncias" });
    }
  }

  async getById(req, res) {
    try {
      const data = await EstanciaModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Estância não encontrada" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Estância" });
    }
  }

  async create(req, res) {
    try {
      const result = await EstanciaModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar Estância" });
    }
  }

  async update(req, res) {
    try {
      const result = await EstanciaModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Estância" });
    }
  }

  async delete(req, res) {
    try {
      const result = await EstanciaModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Estância" });
    }
  }
}

export default new EstanciaController();
