import { appEnv } from "../env/appEnv";

export class ArquivosApi {
  async getAll(params = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const url = `${appEnv.server}/arquivos${qs.toString() ? `?${qs}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao buscar Arquivos");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/arquivos/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar Arquivo");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/arquivos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar Arquivo");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/arquivos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar Arquivo");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/arquivos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar Arquivo");
    return await response.json();
  }

  async emprestar(id) {
    const response = await fetch(`${appEnv.server}/arquivos/${id}/emprestar`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Erro ao emprestar Arquivo");
    return await response.json();
  }

  async devolver(id) {
    const response = await fetch(`${appEnv.server}/arquivos/${id}/devolver`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Erro ao devolver Arquivo");
    return await response.json();
  }
}
