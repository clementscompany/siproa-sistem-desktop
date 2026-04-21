import { appEnv } from "../env/appEnv";

export class MoradaExportadorApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/morada-exportador`);
    if (!response.ok) throw new Error("Erro ao buscar moradas de exportador");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/morada-exportador/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar morada de exportador");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/morada-exportador`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar morada de exportador");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/morada-exportador/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar morada de exportador");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/morada-exportador/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar morada de exportador");
    return await response.json();
  }
}
