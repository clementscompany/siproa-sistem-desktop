import { appEnv } from "../env/appEnv";

export class IneExportadorApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/ine-exportador`);
    if (!response.ok) throw new Error("Erro ao buscar INEs de exportador");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/ine-exportador/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar INE de exportador");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/ine-exportador`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar INE de exportador");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/ine-exportador/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar INE de exportador");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/ine-exportador/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar INE de exportador");
    return await response.json();
  }
}
