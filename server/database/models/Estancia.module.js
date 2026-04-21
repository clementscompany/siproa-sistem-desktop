import { DB } from "../db.js";

class EstanciaModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM estancias WHERE active = 1 ORDER BY nome ASC`;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM estancias WHERE id = ? AND active = 1`;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO estancias (nome, codigo, localizacao)
        VALUES (?, ?, ?)
      `;
      const params = [
        data.nome,
        data.codigo || null,
        data.localizacao || null
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
        UPDATE estancias 
        SET nome = ?, codigo = ?, localizacao = ?
        WHERE id = ?
      `;
      const params = [
        data.nome,
        data.codigo || null,
        data.localizacao || null,
        id
      ];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE estancias SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new EstanciaModule();
