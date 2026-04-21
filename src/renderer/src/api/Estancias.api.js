import { appEnv } from "../env/appEnv";

export class EstanciasApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/estancias`);
    if (!response.ok) throw new Error("Erro ao buscar estâncias");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/estancias/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar estância");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/estancias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar estância");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/estancias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar estância");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/estancias/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar estância");
    return await response.json();
  }
}
