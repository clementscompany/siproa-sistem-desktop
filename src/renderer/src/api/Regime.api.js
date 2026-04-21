import { appEnv } from "../env/appEnv";

export class RegimeApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/regimes`);
    if (!response.ok) throw new Error("Erro ao buscar Regimes");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/regimes/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar Regime");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/regimes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar Regime");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/regimes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar Regime");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/regimes/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar Regime");
    return await response.json();
  }
}
