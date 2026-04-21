import { DB } from "../db.js";

class IneExportadorModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ine_exportador WHERE active = 1 ORDER BY codigo ASC`;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ine_exportador WHERE id = ? AND active = 1`;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO ine_exportador (codigo)
        VALUES (?)
      `;
      const params = [data.codigo];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE ine_exportador 
        SET codigo = ?
        WHERE id = ?
      `;
      const params = [data.codigo, id];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE ine_exportador SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new IneExportadorModule();
