import { DB } from "../db.js";

class AnexosModule {
  async listByArquivoId(arquivoId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT *
        FROM anexos
        WHERE arquivo_id = ? AND active = 1
        ORDER BY id DESC
      `;
      DB.all(query, [arquivoId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM anexos WHERE id = ? AND active = 1`;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO anexos (
          arquivo_id,
          nome_do_arquivo,
          tipo_de_arquivo,
          caminho_do_arquivo,
          tamanho_bytes
        ) VALUES (?, ?, ?, ?, ?)
      `;
      const params = [
        data.arquivo_id,
        data.nome_do_arquivo,
        data.tipo_de_arquivo ?? null,
        data.caminho_do_arquivo,
        data.tamanho_bytes ?? null,
      ];
      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE anexos SET active = 0 WHERE id = ? AND active = 1`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new AnexosModule();
