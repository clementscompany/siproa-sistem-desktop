import { DB } from "../db.js";

class ProcessosModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT contas.*, 
               importadores.nome as cliente_nome,
               importadores.nif as cliente_nif
        FROM contas 
        LEFT JOIN importadores ON contas.importador_id = importadores.id 
        WHERE contas.active = 1
        ORDER BY contas.id DESC
      `;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT contas.*, 
               importadores.nome as cliente_nome,
               importadores.nif as cliente_nif
        FROM contas 
        LEFT JOIN importadores ON contas.importador_id = importadores.id 
        WHERE contas.id = ?
      `;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO contas (
          importador_id, data_abertura, data_entrada, data_pagamento,
          fob, cif, frete, valor_aduaneiro, cambio, moeda,
          manifest_numero, doc_transporte, registo_transporte,
          valor_a_pagar_du, subtotal, total, status, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        data.importador_id || null,
        data.data_abertura || null,
        data.data_entrada || null,
        data.data_pagamento || null,
        data.fob || 0,
        data.cif || 0,
        data.frete || 0,
        data.valor_aduaneiro || 0,
        data.cambio || 1,
        data.moeda || 'AOA',
        data.manifest_numero || null,
        data.doc_transporte || null,
        data.registo_transporte || null,
        data.valor_a_pagar_du || 0,
        data.subtotal || 0,
        data.total || 0,
        data.status || 'aberta',
        data.observacoes || null
      ];

      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE contas SET
          importador_id = ?, data_abertura = ?, data_entrada = ?, data_pagamento = ?,
          fob = ?, cif = ?, frete = ?, valor_aduaneiro = ?, cambio = ?, moeda = ?,
          manifest_numero = ?, doc_transporte = ?, registo_transporte = ?,
          valor_a_pagar_du = ?, subtotal = ?, total = ?, status = ?, observacoes = ?,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const params = [
        data.importador_id || null,
        data.data_abertura || null,
        data.data_entrada || null,
        data.data_pagamento || null,
        data.fob || 0,
        data.cif || 0,
        data.frete || 0,
        data.valor_aduaneiro || 0,
        data.cambio || 1,
        data.moeda || 'AOA',
        data.manifest_numero || null,
        data.doc_transporte || null,
        data.registo_transporte || null,
        data.valor_a_pagar_du || 0,
        data.subtotal || 0,
        data.total || 0,
        data.status || 'aberta',
        data.observacoes || null,
        id
      ];

      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE contas SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new ProcessosModule();
