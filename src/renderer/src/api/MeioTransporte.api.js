import { appEnv } from "../env/appEnv";

export class MeioTransporteApi {
  async getAll() {
    const response = await fetch(`${appEnv.server}/meios-transporte`);
    if (!response.ok) throw new Error("Erro ao buscar Meios de Transporte");
    return await response.json();
  }

  async getById(id) {
    const response = await fetch(`${appEnv.server}/meios-transporte/${id}`);
    if (!response.ok) throw new Error("Erro ao buscar Meio de Transporte");
    return await response.json();
  }

  async create(data) {
    const response = await fetch(`${appEnv.server}/meios-transporte`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar Meio de Transporte");
    return await response.json();
  }

  async update(id, data) {
    const response = await fetch(`${appEnv.server}/meios-transporte/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao atualizar Meio de Transporte");
    return await response.json();
  }

  async delete(id) {
    const response = await fetch(`${appEnv.server}/meios-transporte/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar Meio de Transporte");
    return await response.json();
  }
}
