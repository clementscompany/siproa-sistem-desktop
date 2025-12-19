import ClientModule from "../../database/models/Client.module.js";

class ClientController {
  async getAll(req, res) {
    try {
      const data = await ClientModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Clientes" });
    }
  }

  async getById(req, res) {
    try {
      const data = await ClientModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Importador não encontrado" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Importador" });
    }
  }

  async create(req, res) {
    try {
      const result = await ClientModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar Cliente" });
    }
  }

  async update(req, res) {
    try {
      const result = await ClientModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Cliente" });
    }
  }

  async delete(req, res) {
    try {
      const result = await ClientModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Cliente" });
    }
  }
}

export default new ClientController();
