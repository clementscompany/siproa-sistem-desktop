import { DB } from "../db.js";

class ClientModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      // Assuming 'importadores' are the clients
      const query = `SELECT * FROM importadores WHERE active = 1`;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM importadores WHERE id = ? AND active = 1`;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Add other CRUD methods if needed by the user
  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO importadores (codigo, nome, nif, morada, nacionalidade, telefone, email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        data.codigo || `IMP-${Date.now()}`,
        data.nome,
        data.nif,
        data.morada,
        data.nacionalidade,
        data.telefone,
        data.email,
      ];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE importadores 
        SET codigo = ?, nome = ?, nif = ?, morada = ?, nacionalidade = ?, telefone = ?, email = ?
        WHERE id = ?
      `;
      const params = [
        data.codigo,
        data.nome,
        data.nif,
        data.morada,
        data.nacionalidade,
        data.telefone,
        data.email,
        id,
      ];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE importadores SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new ClientModule();
