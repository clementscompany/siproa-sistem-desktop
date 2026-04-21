import { appEnv } from "../env/appEnv";

export class ProcessosApi {
  async getAll(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const url = `${appEnv.server}/processos${qs.toString() ? `?${qs}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar Processos");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/processos/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar Processo");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/processos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar Processo");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/processos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar Processo");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/processos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar Processo");
    return await response.json();
  }
}
