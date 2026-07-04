import { DB } from "../db.js";

class ProcessosModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT contas.*, 
               importadores.nome as cliente_nome,
               importadores.nif as cliente_nif,
               importadores.morada as cliente_morada
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
               importadores.nif as cliente_nif,
               importadores.morada as cliente_morada
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
          importador_id, conta_numero, contablista, quantidade_adicoes,
          cambio_usd, cod_regime, moeda, cambio_moeda, estancia,
          fob, peso_bruto, fiscalizacao_porto, frete, peso_liquido,
          aeroporto, soma, numero_volume, cif, cod_volume, seguro,
          importador_nif, importador_morada, importador_ine,
          exportador_nome, exportador_cod, exportador_ine, exportador_morada,
          meio_transporte, nacionalidade, registo_transporte, manifest_numero,
          doc_transporte, data_chegada, porto_entrada_saida, posto_fronteirico,
          garantia_nr, montante_garantia, metodo_avaliacao, forma_pagamento,
          detalhes_banco, descricao, local_embarque, pais_procedencia,
          pais_destino, data_du, status, observacoes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        data.importador_id || null,
        data.conta_numero || null,
        data.contablista || null,
        data.quantidade_adicoes || null,
        data.cambio_usd || null,
        data.cod_regime || null,
        data.moeda || "AOA",
        data.cambio_moeda || null,
        data.estancia || null,
        data.fob || 0,
        data.peso_bruto || 0,
        data.fiscalizacao_porto || 0,
        data.frete || 0,
        data.peso_liquido || 0,
        data.aeroporto || 0,
        data.soma || 0,
        data.numero_volume || 0,
        data.cif || 0,
        data.cod_volume || null,
        data.seguro || 0,
        data.importador_nif || null,
        data.importador_morada || null,
        data.importador_ine || null,
        data.exportador_nome || null,
        data.exportador_cod || null,
        data.exportador_ine || null,
        data.exportador_morada || null,
        data.meio_transporte || null,
        data.nacionalidade || null,
        data.registo_transporte || null,
        data.manifest_numero || null,
        data.doc_transporte || null,
        data.data_chegada || null,
        data.porto_entrada_saida || null,
        data.posto_fronteirico || null,
        data.garantia_nr || null,
        data.montante_garantia || 0,
        data.metodo_avaliacao || null,
        data.forma_pagamento || null,
        data.detalhes_banco || null,
        data.descricao || null,
        data.local_embarque || null,
        data.pais_procedencia || null,
        data.pais_destino || null,
        data.data_du || null,
        data.status || "aberta",
        data.observacoes || null,
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
          importador_id = ?, conta_numero = ?, contablista = ?, quantidade_adicoes = ?,
          cambio_usd = ?, cod_regime = ?, moeda = ?, cambio_moeda = ?, estancia = ?,
          fob = ?, peso_bruto = ?, fiscalizacao_porto = ?, frete = ?, peso_liquido = ?,
          aeroporto = ?, soma = ?, numero_volume = ?, cif = ?, cod_volume = ?, seguro = ?,
          importador_nif = ?, importador_morada = ?, importador_ine = ?,
          exportador_nome = ?, exportador_cod = ?, exportador_ine = ?, exportador_morada = ?,
          meio_transporte = ?, nacionalidade = ?, registo_transporte = ?, manifest_numero = ?,
          doc_transporte = ?, data_chegada = ?, porto_entrada_saida = ?, posto_fronteirico = ?,
          garantia_nr = ?, montante_garantia = ?, metodo_avaliacao = ?, forma_pagamento = ?,
          detalhes_banco = ?, descricao = ?, local_embarque = ?, pais_procedencia = ?,
          pais_destino = ?, data_du = ?, status = ?, observacoes = ?,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const params = [
        data.importador_id || null,
        data.conta_numero || null,
        data.contablista || null,
        data.quantidade_adicoes || null,
        data.cambio_usd || null,
        data.cod_regime || null,
        data.moeda || "AOA",
        data.cambio_moeda || null,
        data.estancia || null,
        data.fob || 0,
        data.peso_bruto || 0,
        data.fiscalizacao_porto || 0,
        data.frete || 0,
        data.peso_liquido || 0,
        data.aeroporto || 0,
        data.soma || 0,
        data.numero_volume || 0,
        data.cif || 0,
        data.cod_volume || null,
        data.seguro || 0,
        data.importador_nif || null,
        data.importador_morada || null,
        data.importador_ine || null,
        data.exportador_nome || null,
        data.exportador_cod || null,
        data.exportador_ine || null,
        data.exportador_morada || null,
        data.meio_transporte || null,
        data.nacionalidade || null,
        data.registo_transporte || null,
        data.manifest_numero || null,
        data.doc_transporte || null,
        data.data_chegada || null,
        data.porto_entrada_saida || null,
        data.posto_fronteirico || null,
        data.garantia_nr || null,
        data.montante_garantia || 0,
        data.metodo_avaliacao || null,
        data.forma_pagamento || null,
        data.detalhes_banco || null,
        data.descricao || null,
        data.local_embarque || null,
        data.pais_procedencia || null,
        data.pais_destino || null,
        data.data_du || null,
        data.status || "aberta",
        data.observacoes || null,
        id,
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
