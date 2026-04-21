import { appEnv } from "../env/appEnv";

export class FormasPagamentoApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/formas-pagamento`);
    if (!response.ok) throw new Error("Erro ao buscar Formas de Pagamento");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/formas-pagamento/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar Forma de Pagamento");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/formas-pagamento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar Forma de Pagamento");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/formas-pagamento/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar Forma de Pagamento");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/formas-pagamento/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar Forma de Pagamento");
    return await response.json();
  }
}
