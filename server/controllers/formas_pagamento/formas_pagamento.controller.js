import FormasPagamentoModule from "../../database/models/FormasPagamento.module.js";

class FormasPagamentoController {
  async getAll(req, res) {
    try {
      const data = await FormasPagamentoModule.getAll();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Formas de Pagamento" });
    }
  }

  async getById(req, res) {
    try {
      const data = await FormasPagamentoModule.getById(req.params.id);
      if (!data) {
        return res.status(404).json({ error: "Forma de Pagamento não encontrada" });
      }
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar Forma de Pagamento" });
    }
  }

  async create(req, res) {
    try {
      const result = await FormasPagamentoModule.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar Forma de Pagamento" });
    }
  }

  async update(req, res) {
    try {
      const result = await FormasPagamentoModule.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar Forma de Pagamento" });
    }
  }

  async delete(req, res) {
    try {
      const result = await FormasPagamentoModule.delete(req.params.id);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar Forma de Pagamento" });
    }
  }
}

export default new FormasPagamentoController();
