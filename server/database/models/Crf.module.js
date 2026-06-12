import { DB } from "../db.js";

class CrfModule {
  async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT crf.*, 
               importadores.nome as cliente_nome,
               importadores.nif as cliente_nif,
               importadores.morada as cliente_endereco,
               importadores.telefone as cliente_telefone,
               vias.nome as via_antiga,
               paises.nome as origem_nome
        FROM crf 
        LEFT JOIN importadores ON crf.cliente_id = importadores.id 
        LEFT JOIN vias ON crf.via_id = vias.id
        LEFT JOIN paises ON crf.pais_id = paises.codigo
        WHERE crf.active = 1
        ORDER BY crf.id DESC
      `;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else {
          const result = rows.map((row) => ({
            ...row,
            via: row.via || row.via_antiga,
          }));
          resolve(result);
        }
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT crf.*, 
               importadores.nome as cliente_nome,
               importadores.nif as cliente_nif,
               importadores.morada as cliente_endereco,
               importadores.telefone as cliente_telefone,
               vias.nome as via_antiga,
               paises.nome as origem_nome
        FROM crf 
        LEFT JOIN importadores ON crf.cliente_id = importadores.id 
        LEFT JOIN vias ON crf.via_id = vias.id
        LEFT JOIN paises ON crf.pais_id = paises.codigo
        WHERE crf.id = ?
      `;
      DB.get(query, [id], (err, row) => {
        if (err) reject(err);
        else {
          if (row) {
            row.via = row.via || row.via_antiga;
          }
          resolve(row);
        }
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      const numeroCrfFinal = data.numero_crf || `CRF-${Date.now()}`;

      const toNumber = (v, def = 0) => {
        const n = parseFloat(v);
        return isNaN(n) ? def : n;
      };

      const query = `
      INSERT INTO crf (
        numero_crf, req_f, cliente_id, cliente_nome, cliente_nif, cliente_endereco, data_entrada, data_pagamento,
        du_numero, bl_numero, c_marca, crf_ou_f, factura,
        fob, frete, seguro, cif,
        imposto_s_impo, iva, imposto_selo, sobre_taxa, emolumentos_gerais, multas_crf, subtotal,
        ep17, ep_15, ep_14,
        servico_transitario, veterinario_saude, validacao_bl, assistencia, deslocacao, honorario, inerentes,
        licenciamento, declaracao_valor, modelo0, fotocopias, continuacoes_adicoes,
        t_emolument, total_geral, total_por_extenso,
        consignatario, via, via_id,
        pais_id, pais_nome,
        moeda, cambio, cambio_usd, valor_aduaneiro, designacao,
        observacoes, estado_pagamento, referencia_bancaria
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `;

      const params = [
        numeroCrfFinal,
        data.req_f || null,
        data.cliente_id || null,
        data.cliente_nome || data.cliente || null,
        data.cliente_nif || null,
        data.cliente_endereco || null,
        data.data_entrada || null,
        data.data_pagamento || null,

        data.du_numero || null,
        data.bl_numero || null,
        data.c_marca || null,
        data.crf_ou_f || null,
        data.factura || null,

        toNumber(data.fob),
        toNumber(data.frete),
        toNumber(data.seguro),
        toNumber(data.cif),

        toNumber(data.imposto_s_impo),
        toNumber(data.iva),
        toNumber(data.imposto_selo),
        toNumber(data.sobre_taxa),
        toNumber(data.emolumentos_gerais),
        toNumber(data.multas_crf),
        toNumber(data.subtotal),

        toNumber(data.ep17),
        toNumber(data.ep_15),
        toNumber(data.ep_14),

        toNumber(data.servico_transitario),
        toNumber(data.veterinario_saude),
        toNumber(data.validacao_bl),
        toNumber(data.assistencia),
        toNumber(data.deslocacao),
        toNumber(data.honorario),
        toNumber(data.inerentes),

        toNumber(data.licenciamento),
        toNumber(data.declaracao_valor),
        toNumber(data.modelo0),
        toNumber(data.fotocopias),
        toNumber(data.continuacoes_adicoes),

        toNumber(data.t_emolument),
        toNumber(data.total_geral),
        data.total_por_extenso || null,

        data.consignatario || null,
        data.via || null,
        data.via_id || null,

        data.pais_id || null,
        data.pais_nome || null,

        data.moeda || null,
        toNumber(data.cambio, 1),
        toNumber(data.cambio_usd, 1),
        toNumber(data.valor_aduaneiro),
        data.designacao || null,

        data.observacoes || null,
        data.estado_pagamento || "PENDENTE",
        data.referencia_bancaria || null,
      ];

      DB.run(query, params, function (err) {
        if (err) {
          console.error("Erro ao inserir CRF:", err);
          console.error("Params:", params.length);
          return reject(err);
        }

        resolve({
          id: this.lastID,
          numero_crf: numeroCrfFinal,
          ...data,
        });
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE crf SET 
        req_f = ?, cliente_id = ?, cliente_nome = ?, cliente_nif = ?, cliente_endereco = ?, data_entrada = ?, data_pagamento = ?,
        du_numero = ?, bl_numero = ?, c_marca = ?, crf_ou_f = ?, factura = ?,
        fob = ?, frete = ?, seguro = ?, cif = ?,
        imposto_s_impo = ?, iva = ?, imposto_selo = ?, sobre_taxa = ?, emolumentos_gerais = ?, multas_crf = ?, subtotal = ?,
        ep17 = ?, ep_15 = ?, ep_14 = ?, servico_transitario = ?, veterinario_saude = ?, validacao_bl = ?, assistencia = ?, deslocacao = ?, honorario = ?, inerentes = ?,
        licenciamento = ?, declaracao_valor = ?, modelo0 = ?, fotocopias = ?, continuacoes_adicoes = ?,
        t_emolument = ?, total_geral = ?, total_por_extenso = ?,
        consignatario = ?, via = ?, via_id = ?, pais_id = ?, pais_nome = ?, moeda = ?, cambio = ?, cambio_usd = ?, valor_aduaneiro = ?, designacao = ?,
        observacoes = ?, estado_pagamento = ?, referencia_bancaria = ?
      WHERE id = ?
    `;

      const toNumber = (v, def = 0) => {
        const n = parseFloat(v);
        return isNaN(n) ? def : n;
      };

      const params = [
        data.req_f || null,
        data.cliente_id || null,
        data.cliente_nome || data.cliente || null,
        data.cliente_nif || null,
        data.cliente_endereco || null,
        data.data_entrada || null,
        data.data_pagamento || null,
        data.du_numero || null,
        data.bl_numero || null,
        data.c_marca || null,
        data.crf_ou_f || null,
        data.factura || null,

        toNumber(data.fob),
        toNumber(data.frete),
        toNumber(data.seguro),
        toNumber(data.cif),

        toNumber(data.imposto_s_impo),
        toNumber(data.iva),
        toNumber(data.imposto_selo),
        toNumber(data.sobre_taxa),
        toNumber(data.emolumentos_gerais),
        toNumber(data.multas_crf),
        toNumber(data.subtotal),

        toNumber(data.ep17),
        toNumber(data.ep_15),
        toNumber(data.ep_14),
        toNumber(data.servico_transitario),
        toNumber(data.veterinario_saude),
        toNumber(data.validacao_bl),
        toNumber(data.assistencia),
        toNumber(data.deslocacao),
        toNumber(data.honorario),
        toNumber(data.inerentes),

        toNumber(data.licenciamento),
        toNumber(data.declaracao_valor),
        toNumber(data.modelo0),
        toNumber(data.fotocopias),
        toNumber(data.continuacoes_adicoes),

        toNumber(data.t_emolument),
        toNumber(data.total_geral),
        data.total_por_extenso || null,

        data.consignatario || null,
        data.via || null,
        data.via_id || null,

        data.pais_id || null,
        data.pais_nome || null,

        data.moeda || null,
        toNumber(data.cambio, 1),
        toNumber(data.cambio_usd, 1),
        toNumber(data.valor_aduaneiro),

        data.designacao || null,
        data.observacoes || null,
        data.estado_pagamento || "PENDENTE",
        data.referencia_bancaria || null,

        id,
      ];

      DB.run(query, params, function (err) {
        if (err) return reject(err);
        resolve({ affected: this.changes });
      });
    });
  }
  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE crf SET active = 0 WHERE id = ?`;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new CrfModule();
