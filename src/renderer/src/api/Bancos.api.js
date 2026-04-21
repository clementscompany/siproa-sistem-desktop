import { appEnv } from "../env/appEnv";

export class BancosApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/bancos`);
    if (!response.ok) throw new Error("Erro ao buscar Bancos");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/bancos/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar Banco");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/bancos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar Banco");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/bancos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar Banco");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/bancos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar Banco");
    return await response.json();
  }
}
