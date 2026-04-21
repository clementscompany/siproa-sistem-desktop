import { appEnv } from "../env/appEnv";

export class CodExportadorApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/cod-exportador`);
    if (!response.ok) throw new Error("Erro ao buscar códigos de exportador");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/cod-exportador/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar código de exportador");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/cod-exportador`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar código de exportador");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/cod-exportador/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar código de exportador");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/cod-exportador/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar código de exportador");
    return await response.json();
  }
}
