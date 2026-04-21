import { DB } from "../db.js";

class BancosModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM bancos WHERE active = 1`;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM bancos WHERE id = ? AND active = 1`;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO bancos (nome, codigo, conta_numero, iban)
        VALUES (?, ?, ?, ?)
      `;
      const params = [
        data.nome,
        data.codigo || `BK-${Date.now()}`,
        data.conta_numero,
        data.iban
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
        UPDATE bancos 
        SET nome = ?, codigo = ?, conta_numero = ?, iban = ?
        WHERE id = ?
      `;
      const params = [
        data.nome,
        data.codigo,
        data.conta_numero,
        data.iban,
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
      const query = `UPDATE bancos SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new BancosModule();
