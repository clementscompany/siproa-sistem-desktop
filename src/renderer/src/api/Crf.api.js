import { appEnv } from "../env/appEnv";

export class CrfApi {
  async getAll() {
    try {
      const response = await fetch(`${appEnv.server}/crf`);
      if (!response.ok) throw new Error("Erro ao buscar CRFs");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await fetch(`${appEnv.server}/crf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.details ||
            `Erro ao criar CRF: ${response.status}`,
        );
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(`${appEnv.server}/crf/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar CRF");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await fetch(`${appEnv.server}/crf/${id}`);
      if (!response.ok) throw new Error("Erro ao buscar CRF");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${appEnv.server}/crf/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao deletar CRF");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getClients() {
    try {
      const response = await fetch(`${appEnv.server}/clients`);
      if (!response.ok) throw new Error("Erro ao buscar clientes");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async createClient(data) {
    try {
      const response = await fetch(`${appEnv.server}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao criar cliente");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async updateClient(id, data) {
    try {
      const response = await fetch(`${appEnv.server}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao atualizar cliente");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async deleteClient(id) {
    try {
      const response = await fetch(`${appEnv.server}/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao eliminar cliente");
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}
