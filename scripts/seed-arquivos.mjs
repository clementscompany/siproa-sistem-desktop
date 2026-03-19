import { CreateTable, DB } from "../server/database/db.js";

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    DB.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes, lastID: this.lastID });
    });
  });

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    DB.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const ensureImportador = async (payload) => {
  const existing = await dbGet(
    "SELECT id FROM importadores WHERE (codigo = ? OR nif = ?) AND active = 1 LIMIT 1",
    [payload.codigo, payload.nif],
  );
  if (existing?.id) return existing.id;

  const inserted = await dbRun(
    `INSERT INTO importadores (codigo, nome, nif, morada, nacionalidade, telefone, email)
     VALUES (?, ?, ?, ?, ?, ?, ?)` ,
    [
      payload.codigo,
      payload.nome,
      payload.nif,
      payload.morada,
      payload.nacionalidade,
      payload.telefone,
      payload.email,
    ],
  );
  return inserted.lastID;
};

const ensureArquivo = async (payload) => {
  const existing = await dbGet(
    "SELECT id FROM arquivos WHERE numero_do_processo = ? AND active = 1 LIMIT 1",
    [payload.numero_do_processo],
  );
  if (existing?.id) return existing.id;

  const inserted = await dbRun(
    `INSERT INTO arquivos (
      cliente_id,
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
      devolucao_prevista_em,
      prazo_dias,
      devolvido_em
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [
      payload.cliente_id,
      payload.numero_do_processo,
      payload.descricao_da_mercadoia ?? null,
      payload.situacao ?? "PENDENTE",
      payload.observacao ?? null,
      payload.doc_transporte ?? null,
      payload.guia_contratacao ?? null,
      payload.numero_lote ?? null,
      payload.documento_em_falta ?? null,
      payload.numero_de_certificado ?? null,
      payload.status ?? "ATIVO",
      payload.devolucao_prevista_em ?? null,
      payload.prazo_dias ?? null,
      payload.devolvido_em ?? null,
    ],
  );
  return inserted.lastID;
};

const addDaysDateOnly = (days) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

async function main() {
  CreateTable();

  const clienteId = await ensureImportador({
    codigo: "SEED-IMP-001",
    nome: "Cliente Seed (Empréstimos)",
    nif: "700000000",
    morada: "Luanda",
    nacionalidade: "AO",
    telefone: "900000010",
    email: "seed@exemplo.com",
  });

  await ensureArquivo({
    cliente_id: clienteId,
    numero_do_processo: "PROC-SEED-001",
    descricao_da_mercadoia: "Arquivo seed - no prazo",
    doc_transporte: "BL-SEED-1",
    status: "ATIVO",
    situacao: "PENDENTE",
    prazo_dias: 2,
    devolucao_prevista_em: addDaysDateOnly(2),
  });

  await ensureArquivo({
    cliente_id: clienteId,
    numero_do_processo: "PROC-SEED-002",
    descricao_da_mercadoia: "Arquivo seed - atrasado",
    doc_transporte: "BL-SEED-2",
    status: "ATIVO",
    situacao: "PENDENTE",
    devolucao_prevista_em: "2000-01-01",
  });

  await ensureArquivo({
    cliente_id: clienteId,
    numero_do_processo: "PROC-SEED-003",
    descricao_da_mercadoia: "Arquivo seed - devolvido",
    doc_transporte: "BL-SEED-3",
    status: "ATIVO",
    situacao: "CONCLUIDO",
    devolucao_prevista_em: "2000-01-01",
    devolvido_em: "2000-01-02",
  });

  console.log("Seed de Arquivos concluído.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

