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
        LEFT JOIN paises ON crf.pais_id = paises.id
        WHERE crf.active = 1
        ORDER BY crf.id DESC
      `;
      DB.all(query, (err, rows) => {
        if (err) reject(err);
        else {
          // Mapeia para garantir que 'via' tenha valor (novo ou antigo)
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
        LEFT JOIN paises ON crf.pais_id = paises.id
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
      // Não salvar país no banco - apenas usar o código da constante
      // Se pais_id for um código (string), buscar o ID na tabela paises se existir
      // Caso contrário, usar null (país não precisa estar no banco)
      let paisIdFinal = null;

      const insertCrf = () => {
        const query = `
          INSERT INTO crf (
            numero_crf, req_f, cliente_id, cliente_nome, data_entrada, data_pagamento,
            du_numero, bl_numero, c_marca, crf_ou_f, factura,
            fob, frete, seguro, cif,
            imposto_s_impo, iva, imposto_selo, sobre_taxa, emolumentos_gerais, multas_crf, subtotal,
            ep17, ep_15, ep_14, servico_transitario, veterinario_saude, validacao_bl, assistencia, deslocacao, honorario, inerentes,
            licenciamento, declaracao_valor, modelo0, fotocopias, continuacoes_adicoes,
            t_emolument, total_geral, total_por_extenso,
            consignatario, via, pais_id, moeda, cambio, cambio_usd, valor_aduaneiro, designacao,
            observacoes, estado_pagamento, referencia_bancaria
          ) VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?
          )
        `;

        const numeroCrfFinal = data.numero_crf || `CRF-${Date.now()}`;
        const params = [
          numeroCrfFinal,
          data.req_f || null,
          data.cliente_id || null,
          data.cliente || null,
          data.data_entrada || null,
          data.data_pagamento || null,
          data.du_numero || null,
          data.bl_numero || null,
          data.c_marca || null,
          data.crf_ou_f || null,
          data.factura || null,
          parseFloat(data.fob) || 0,
          parseFloat(data.frete) || 0,
          parseFloat(data.seguro) || 0,
          parseFloat(data.cif) || 0,
          parseFloat(data.imposto_s_impo) || 0,
          parseFloat(data.iva) || 0,
          parseFloat(data.imposto_selo) || 0,
          parseFloat(data.sobre_taxa) || 0,
          parseFloat(data.emolumentos_gerais) || 0,
          parseFloat(data.multas_crf) || 0,
          parseFloat(data.subtotal) || 0,
          parseFloat(data.ep17) || 0,
          parseFloat(data.ep_15) || 0,
          parseFloat(data.ep_14) || 0,
          parseFloat(data.servico_transitario) || 0,
          parseFloat(data.veterinario_saude) || 0,
          parseFloat(data.validacao_bl) || 0,
          parseFloat(data.assistencia) || 0,
          parseFloat(data.deslocacao) || 0,
          parseFloat(data.honorario) || 0,
          parseFloat(data.inerentes) || 0,
          parseFloat(data.licenciamento) || 0,
          parseFloat(data.declaracao_valor) || 0,
          parseFloat(data.modelo0) || 0,
          parseFloat(data.fotocopias) || 0,
          parseFloat(data.continuacoes_adicoes) || 0,
          parseFloat(data.t_emolument) || 0,
          parseFloat(data.total_geral) || 0,
          data.total_por_extenso || null,
          data.consignatario || null,
          data.via || null,
          paisIdFinal || null,
          data.moeda || null,
          parseFloat(data.cambio) || 1,
          parseFloat(data.cambio_usd) || 1,
          parseFloat(data.valor_aduaneiro) || 0,
          data.designacao || null,
          data.observacoes || null,
          data.estado_pagamento || "PENDENTE",
          data.referencia_bancaria || null,
        ];

        DB.run(query, params, function (err) {
          if (err) {
            console.error("Erro ao inserir CRF:", err);
            console.error("Query:", query);
            console.error("Params count:", params.length);
            console.error("Params:", params);
            reject(err);
          } else {
            resolve({ id: this.lastID, ...data, numero_crf: numeroCrfFinal });
          }
        });
      };

      // Processar país se necessário
      if (data.pais_id) {
        // Se for número, usar diretamente
        if (typeof data.pais_id === "number") {
          paisIdFinal = data.pais_id;
          insertCrf();
        }
        // Se for código string, tentar buscar na tabela (opcional)
        else if (typeof data.pais_id === "string" && data.pais_id.length <= 3) {
          DB.get(
            `SELECT id FROM paises WHERE codigo = ? LIMIT 1`,
            [data.pais_id],
            (err, row) => {
              if (!err && row) {
                paisIdFinal = row.id;
              }
              // Se não encontrar, usa null (país não precisa estar no banco)
              insertCrf();
            },
          );
        } else {
          insertCrf();
        }
      } else {
        insertCrf();
      }
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE crf SET 
          req_f = ?, cliente_id = ?, cliente_nome = ?, data_entrada = ?, data_pagamento = ?,
          du_numero = ?, bl_numero = ?, c_marca = ?, crf_ou_f = ?, factura = ?,
          fob = ?, frete = ?, seguro = ?, cif = ?,
          imposto_s_impo = ?, iva = ?, imposto_selo = ?, sobre_taxa = ?, emolumentos_gerais = ?, multas_crf = ?, subtotal = ?,
          ep17 = ?, ep_15 = ?, ep_14 = ?, servico_transitario = ?, veterinario_saude = ?, validacao_bl = ?, assistencia = ?, deslocacao = ?, honorario = ?, inerentes = ?,
          licenciamento = ?, declaracao_valor = ?, modelo0 = ?, fotocopias = ?, continuacoes_adicoes = ?,
          t_emolument = ?, total_geral = ?, total_por_extenso = ?,
          consignatario = ?, via = ?, pais_id = ?, moeda = ?, cambio = ?, cambio_usd = ?, valor_aduaneiro = ?, designacao = ?,
          observacoes = ?, estado_pagamento = ?, referencia_bancaria = ?
        WHERE id = ?
      `;

      const runUpdate = (paisIdFinal) => {
        const params = [
          data.req_f || null,
          data.cliente_id || null,
          data.cliente || null,
          data.data_entrada || null,
          data.data_pagamento || null,
          data.du_numero || null,
          data.bl_numero || null,
          data.c_marca || null,
          data.crf_ou_f || null,
          data.factura || null,
          parseFloat(data.fob) || 0,
          parseFloat(data.frete) || 0,
          parseFloat(data.seguro) || 0,
          parseFloat(data.cif) || 0,
          parseFloat(data.imposto_s_impo) || 0,
          parseFloat(data.iva) || 0,
          parseFloat(data.imposto_selo) || 0,
          parseFloat(data.sobre_taxa) || 0,
          parseFloat(data.emolumentos_gerais) || 0,
          parseFloat(data.multas_crf) || 0,
          parseFloat(data.subtotal) || 0,
          parseFloat(data.ep17) || 0,
          parseFloat(data.ep_15) || 0,
          parseFloat(data.ep_14) || 0,
          parseFloat(data.servico_transitario) || 0,
          parseFloat(data.veterinario_saude) || 0,
          parseFloat(data.validacao_bl) || 0,
          parseFloat(data.assistencia) || 0,
          parseFloat(data.deslocacao) || 0,
          parseFloat(data.honorario) || 0,
          parseFloat(data.inerentes) || 0,
          parseFloat(data.licenciamento) || 0,
          parseFloat(data.declaracao_valor) || 0,
          parseFloat(data.modelo0) || 0,
          parseFloat(data.fotocopias) || 0,
          parseFloat(data.continuacoes_adicoes) || 0,
          parseFloat(data.t_emolument) || 0,
          parseFloat(data.total_geral) || 0,
          data.total_por_extenso || null,
          data.consignatario || null,
          data.via || null,
          paisIdFinal,
          data.moeda || null,
          parseFloat(data.cambio) || 1,
          parseFloat(data.cambio_usd) || 1,
          parseFloat(data.valor_aduaneiro) || 0,
          data.designacao || null,
          data.observacoes || null,
          data.estado_pagamento || "PENDENTE",
          data.referencia_bancaria || null,
          id,
        ];

        DB.run(query, params, function (err) {
          if (err) reject(err);
          else resolve({ affected: this.changes });
        });
      };

      if (typeof data.pais_id === "number") return runUpdate(data.pais_id);

      if (typeof data.pais_id === "string") {
        const trimmed = data.pais_id.trim();
        if (!trimmed) return runUpdate(null);

        if (/^\d+$/.test(trimmed)) return runUpdate(parseInt(trimmed, 10));

        if (trimmed.length <= 3) {
          DB.get(
            `SELECT id FROM paises WHERE codigo = ? LIMIT 1`,
            [trimmed],
            (err, row) => {
              if (!err && row) return runUpdate(row.id);
              return runUpdate(null);
            },
          );
          return;
        }
      }

      return runUpdate(null);
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
