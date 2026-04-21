import { DB } from "../db.js";

class CodExportadorModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM cod_exportador WHERE active = 1 ORDER BY nome ASC`;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM cod_exportador WHERE id = ? AND active = 1`;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO cod_exportador (nome, codigo)
        VALUES (?, ?)
      `;
      const params = [data.nome, data.codigo];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE cod_exportador 
        SET nome = ?, codigo = ?
        WHERE id = ?
      `;
      const params = [data.nome, data.codigo, id];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE cod_exportador SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new CodExportadorModule();
