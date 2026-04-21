import { DB } from "../db.js";

class MeioTransporteModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM meios_transporte WHERE active = 1`;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM meios_transporte WHERE id = ? AND active = 1`;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO meios_transporte (nome, descricao)
        VALUES (?, ?)
      `;
      const params = [data.nome, data.descricao];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE meios_transporte 
        SET nome = ?, descricao = ?
        WHERE id = ?
      `;
      const params = [data.nome, data.descricao, id];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE meios_transporte SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new MeioTransporteModule();
