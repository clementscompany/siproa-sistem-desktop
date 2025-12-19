import { appEnv } from "../env/appEnv";

export class ImportadoresApi {
  async getAll() {
    try {
      const response = await fetch(`${appEnv.server}/clients`);
      if (!response.ok) throw new Error("Erro ao buscar importadores");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${appEnv.server}/clients/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar importador");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await fetch(`${appEnv.server}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao criar importador");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(`${appEnv.server}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar importador");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${appEnv.server}/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao eliminar importador");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
