import { DB } from "../db.js";

const pad2 = (n) => String(n).padStart(2, "0");

const formatDateOnlyLocal = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const parseDateOnlyEndLocalMs = (value) => {
  if (!value) return null;
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T23:59:59.999`);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }

  const parsed = new Date(s);
  if (Number.isNaN(parsed.getTime())) return null;
  const dateOnly = formatDateOnlyLocal(parsed);
  if (!dateOnly) return null;
  const d = new Date(`${dateOnly}T23:59:59.999`);
  return Number.isNaN(d.getTime()) ? null : d.getTime();
};

const normalizeLoanFields = (data = {}) => {
  const prazoRaw = data.prazo_dias;
  const prazo =
    prazoRaw === "" || prazoRaw === undefined || prazoRaw === null
      ? null
      : Number.isFinite(Number(prazoRaw))
        ? Math.trunc(Number(prazoRaw))
        : NaN;

  if (Number.isNaN(prazo)) throw new Error("prazo_dias inválido");
  if (prazo != null && prazo < 0)
    throw new Error("prazo_dias não pode ser negativo");

  const devolucaoInput = data.devolucao_prevista_em;
  const devolucaoPrevista = devolucaoInput
    ? /^\d{4}-\d{2}-\d{2}$/.test(String(devolucaoInput))
      ? String(devolucaoInput)
      : formatDateOnlyLocal(devolucaoInput)
    : null;

  if (devolucaoInput && !devolucaoPrevista) {
    throw new Error("devolucao_prevista_em inválida");
  }

  const devolvidoInput = data.devolvido_em;
  const devolvidoEm = devolvidoInput
    ? /^\d{4}-\d{2}-\d{2}$/.test(String(devolvidoInput))
      ? String(devolvidoInput)
      : formatDateOnlyLocal(devolvidoInput)
    : null;

  if (devolvidoInput && !devolvidoEm) {
    throw new Error("devolvido_em inválida");
  }

  let computedDue = devolucaoPrevista;
  if (!computedDue && prazo != null) {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + prazo);
    computedDue = formatDateOnlyLocal(base);
  }

  return {
    prazo_dias: prazo,
    devolucao_prevista_em: computedDue,
    devolvido_em: devolvidoEm,
  };
};

const enrichLoanStatus = (row) => {
  const now = Date.now();
  const dueMs = parseDateOnlyEndLocalMs(row?.devolucao_prevista_em);
  const returnedMs = parseDateOnlyEndLocalMs(row?.devolvido_em);

  const devolvido = returnedMs != null;
  const hasDue = dueMs != null;
  const vencida = hasDue && !devolvido && now > dueMs;

  const diasParaDevolucao =
    hasDue && !devolvido
      ? Math.ceil((dueMs - now) / (24 * 60 * 60 * 1000))
      : null;
  const diasEmAtraso = vencida
    ? Math.ceil((now - dueMs) / (24 * 60 * 60 * 1000))
    : null;

  const devolucaoStatus = devolvido
    ? "DEVOLVIDO"
    : vencida
      ? "VENCIDO"
      : hasDue
        ? "NO_PRAZO"
        : "SEM_PRAZO";

  return {
    ...row,
    devolucao_status: devolucaoStatus,
    devolucao_vencida: vencida,
    dias_para_devolucao: diasParaDevolucao,
    dias_em_atraso: diasEmAtraso,
  };
};

class ArquivosModule {
  async getAll(filters = {}) {
    return new Promise((resolve, reject) => {
      const where = ["a.active = 1"];
      const params = [];

      if (filters.cliente_id) {
        where.push("a.cliente_id = ?");
        params.push(filters.cliente_id);
      }
      if (filters.status) {
        where.push("a.status = ?");
        params.push(filters.status);
      }
      if (filters.situacao) {
        where.push("a.situacao = ?");
        params.push(filters.situacao);
      }
      if (filters.q) {
        where.push(
          `(a.numero_do_processo LIKE ? OR a.descricao_da_mercadoia LIKE ? OR a.observacao LIKE ? OR i.nome LIKE ?)`,
        );
        const like = `%${filters.q}%`;
        params.push(like, like, like, like);
      }

      const query = `
        SELECT
          a.*,
          i.nome AS cliente_nome,
          i.nif AS cliente_nif
        FROM arquivos a
        LEFT JOIN importadores i ON i.id = a.cliente_id
        WHERE ${where.join(" AND ")}
        ORDER BY a.id DESC
      `;

      DB.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve((rows || []).map(enrichLoanStatus));
      });
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          a.*,
          i.id AS cliente_id_ref,
          i.codigo AS cliente_codigo,
          i.nome AS cliente_nome,
          i.nif AS cliente_nif,
          i.morada AS cliente_morada,
          i.nacionalidade AS cliente_nacionalidade,
          i.telefone AS cliente_telefone,
          i.email AS cliente_email
        FROM arquivos a
        LEFT JOIN importadores i ON i.id = a.cliente_id
        WHERE a.id = ? AND a.active = 1
        LIMIT 1
      `;

      DB.get(query, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);

        const anexosQuery = `
          SELECT *
          FROM anexos
          WHERE arquivo_id = ? AND active = 1
          ORDER BY id DESC
        `;
        DB.all(anexosQuery, [id], (err2, anexos) => {
          if (err2) return reject(err2);

          const cliente =
            row.cliente_id_ref != null
              ? {
                  id: row.cliente_id_ref,
                  codigo: row.cliente_codigo,
                  nome: row.cliente_nome,
                  nif: row.cliente_nif,
                  morada: row.cliente_morada,
                  nacionalidade: row.cliente_nacionalidade,
                  telefone: row.cliente_telefone,
                  email: row.cliente_email,
                }
              : null;

          const {
            cliente_id_ref,
            cliente_codigo,
            cliente_nome,
            cliente_nif,
            cliente_morada,
            cliente_nacionalidade,
            cliente_telefone,
            cliente_email,
            ...arquivo
          } = row;

          resolve(enrichLoanStatus({ ...arquivo, cliente, anexos }));
        });
      });
    });
  }

  async create(data) {
    return new Promise((resolve, reject) => {
      let loan;
      try {
        loan = normalizeLoanFields(data);
      } catch (e) {
        reject(e);
        return;
      }
      const query = `
        INSERT INTO arquivos (
          cliente_id,
          numero_du,
          numero_do_processo,
          descricao_da_mercadoia,
          situacao,
          observacao,
          doc_transporte,
          guia_contratacao,
          numero_lote,
          documento_em_falta,
          numero_de_certificado,
          status,
          emprestado_em,
          devolucao_prevista_em,
          prazo_dias,
          devolvido_em
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
      `;
      const params = [
        data.cliente_id ?? null,
        data.numero_du ?? null,
        data.numero_do_processo ?? null,
        data.descricao_da_mercadoia ?? null,
        data.situacao ?? "PENDENTE",
        data.observacao ?? null,
        data.doc_transporte ?? null,
        data.guia_contratacao ?? null,
        data.numero_lote ?? null,
        data.documento_em_falta ?? null,
        data.numero_de_certificado ?? null,
        data.status ?? "PENDENTE",
        loan.devolucao_prevista_em ?? null,
        loan.prazo_dias ?? null,
        loan.devolvido_em ?? null,
      ];

      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data, ...loan });
      });
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      let loan;
      try {
        loan = normalizeLoanFields(data);
      } catch (e) {
        reject(e);
        return;
      }
      const query = `
        UPDATE arquivos
        SET
          cliente_id = ?,
          numero_du = ?,
          numero_do_processo = ?,
          descricao_da_mercadoia = ?,
          situacao = ?,
          observacao = ?,
          doc_transporte = ?,
          guia_contratacao = ?,
          numero_lote = ?,
          documento_em_falta = ?,
          numero_de_certificado = ?,
          status = ?,
          devolucao_prevista_em = ?,
          prazo_dias = ?,
          devolvido_em = ?,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ? AND active = 1
      `;
      const params = [
        data.cliente_id ?? null,
        data.numero_du ?? null,
        data.numero_do_processo ?? null,
        data.descricao_da_mercadoia ?? null,
        data.situacao ?? "PENDENTE",
        data.observacao ?? null,
        data.doc_transporte ?? null,
        data.guia_contratacao ?? null,
        data.numero_lote ?? null,
        data.documento_em_falta ?? null,
        data.numero_de_certificado ?? null,
        data.status ?? "PENDENTE",
        loan.devolucao_prevista_em ?? null,
        loan.prazo_dias ?? null,
        loan.devolvido_em ?? null,
        id,
      ];

      DB.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes, id, ...data, ...loan });
      });
    });
  }

  async emprestar(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE arquivos
        SET emprestado_em = CURRENT_TIMESTAMP, devolvido_em = NULL, atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ? AND active = 1
      `;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }

  async devolver(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE arquivos
        SET devolvido_em = DATE('now', 'localtime'), atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ? AND active = 1
      `;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE arquivos
        SET active = 0, atualizado_em = CURRENT_TIMESTAMP
        WHERE id = ? AND active = 1
      `;
      DB.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ affected: this.changes });
      });
    });
  }
}

export default new ArquivosModule();
