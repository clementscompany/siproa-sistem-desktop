import assert from "node:assert/strict";
import test, { after, before } from "node:test";

import { Server } from "../index.js";
import { CreateTable, DB } from "../database/db.js";

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

const waitForTable = async (tableName) => {
  for (let i = 0; i < 50; i += 1) {
    const row = await dbGet(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName],
    );
    if (row?.name === tableName) return;
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new Error(`Tabela "${tableName}" não ficou disponível a tempo`);
};

const fetchJson = async (url, init) => {
  const res = await fetch(url, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { res, json, text };
};

const pad2 = (n) => String(n).padStart(2, "0");
const localDateOnly = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

let listener;
let baseUrl;

before(async () => {
  CreateTable();
  await waitForTable("importadores");
  await waitForTable("arquivos");
  await waitForTable("anexos");

  listener = await new Promise((resolve) => {
    const s = Server.listen(0, "127.0.0.1", () => resolve(s));
  });
  baseUrl = `http://127.0.0.1:${listener.address().port}`;
});

after(() => {
  listener?.close();
});

test("CRUD Arquivos + Anexos: criar, anexar, listar, baixar e eliminar", async () => {
  const createdClient = await fetchJson(`${baseUrl}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: "Cliente Teste Arquivos",
      nif: "999999999",
      morada: "Rua Teste",
      nacionalidade: "AO",
      telefone: "900000000",
      email: "teste@exemplo.com",
    }),
  });
  assert.equal(createdClient.res.status, 201);
  assert.equal(typeof createdClient.json?.id, "number");
  const clienteId = createdClient.json.id;

  const createdArquivo = await fetchJson(`${baseUrl}/arquivos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cliente_id: clienteId,
      numero_do_processo: "PROC-TESTE-001",
      descricao_da_mercadoia: "Mercadoria teste",
      situacao: "PENDENTE",
      observacao: "Obs",
      doc_transporte: "BL-1",
      guia_contratacao: "GUIA-1",
      numero_lote: "LOTE-1",
      documento_em_falta: "NENHUM",
      numero_de_certificado: "CERT-1",
      status: "ATIVO",
      prazo_dias: 1,
      numero_du: "DU-1",
    }),
  });
  assert.equal(createdArquivo.res.status, 201);
  assert.equal(typeof createdArquivo.json?.id, "number");
  const arquivoId = createdArquivo.json.id;

  const form = new FormData();
  form.append(
    "arquivo",
    new Blob(["conteudo-teste"], { type: "text/plain" }),
    "teste.txt",
  );
  const uploadRes = await fetch(`${baseUrl}/arquivos/${arquivoId}/anexos`, {
    method: "POST",
    body: form,
  });
  const uploadText = await uploadRes.text();
  assert.equal(uploadRes.status, 201, uploadText);
  const uploaded = JSON.parse(uploadText);
  assert.equal(typeof uploaded.id, "number");
  const anexoId = uploaded.id;

  const got = await fetchJson(`${baseUrl}/arquivos/${arquivoId}`);
  assert.equal(got.res.status, 200);
  assert.equal(got.json?.id, arquivoId);
  assert.equal(got.json?.numero_du, "DU-1");
  assert.ok(Array.isArray(got.json?.anexos));
  assert.equal(got.json.anexos.length, 1);

  const downloadRes = await fetch(`${baseUrl}/anexos/${anexoId}/download`);
  assert.equal(downloadRes.status, 200);
  const downloadedText = await downloadRes.text();
  assert.equal(downloadedText, "conteudo-teste");

  const deletedAnexo = await fetchJson(`${baseUrl}/anexos/${anexoId}`, {
    method: "DELETE",
  });
  assert.equal(deletedAnexo.res.status, 200);
  assert.equal(deletedAnexo.json?.affected, 1);

  const downloadAfterDelete = await fetch(
    `${baseUrl}/anexos/${anexoId}/download`,
  );
  assert.equal(downloadAfterDelete.status, 404);

  const emprestar = await fetchJson(
    `${baseUrl}/arquivos/${arquivoId}/emprestar`,
    {
      method: "POST",
    },
  );
  assert.equal(emprestar.res.status, 200);
  assert.equal(emprestar.json?.affected, 1);

  const afterEmprestar = await fetchJson(`${baseUrl}/arquivos/${arquivoId}`);
  assert.equal(afterEmprestar.res.status, 200);
  assert.ok(afterEmprestar.json?.emprestado_em);
  assert.equal(afterEmprestar.json?.devolvido_em, null);

  const devolver = await fetchJson(
    `${baseUrl}/arquivos/${arquivoId}/devolver`,
    {
      method: "POST",
    },
  );
  assert.equal(devolver.res.status, 200);
  assert.equal(devolver.json?.affected, 1);

  const afterDevolver = await fetchJson(`${baseUrl}/arquivos/${arquivoId}`);
  assert.equal(afterDevolver.res.status, 200);
  assert.equal(afterDevolver.json?.devolvido_em, localDateOnly());

  const deletedArquivo = await fetchJson(`${baseUrl}/arquivos/${arquivoId}`, {
    method: "DELETE",
  });
  assert.equal(deletedArquivo.res.status, 200);
  assert.equal(deletedArquivo.json?.affected, 1);

  const list = await fetchJson(`${baseUrl}/arquivos`);
  assert.equal(list.res.status, 200);
  assert.ok(Array.isArray(list.json));
  assert.equal(
    list.json.some((row) => row.id === arquivoId),
    false,
    "Arquivo eliminado (active=0) não deve aparecer no GET /arquivos",
  );
});

test("CRUD Arquivos: update/delete retornam 404 quando não existir", async () => {
  const updateMissing = await fetchJson(`${baseUrl}/arquivos/99999999`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numero_do_processo: "X" }),
  });
  assert.equal(updateMissing.res.status, 404);

  const deleteMissing = await fetchJson(`${baseUrl}/arquivos/99999999`, {
    method: "DELETE",
  });
  assert.equal(deleteMissing.res.status, 404);
});

test("Empréstimo: marca como ATRASADO quando passar da devolução", async () => {
  const createdClient = await fetchJson(`${baseUrl}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: "Cliente Teste Vencimento",
      nif: "888888888",
      morada: "Rua Teste",
      nacionalidade: "AO",
      telefone: "900000001",
      email: "vencimento@exemplo.com",
    }),
  });
  assert.equal(createdClient.res.status, 201);
  const clienteId = createdClient.json.id;

  const createdArquivo = await fetchJson(`${baseUrl}/arquivos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cliente_id: clienteId,
      numero_do_processo: "PROC-TESTE-VENCIDO-001",
      status: "ATIVO",
      situacao: "PENDENTE",
      devolucao_prevista_em: "2000-01-01",
    }),
  });
  assert.equal(createdArquivo.res.status, 201);
  const arquivoId = createdArquivo.json.id;

  const list = await fetchJson(`${baseUrl}/arquivos`);
  assert.equal(list.res.status, 200);
  const row = list.json.find((r) => r.id === arquivoId);
  assert.ok(row, "Arquivo criado deve aparecer na listagem");
  assert.equal(row.devolucao_status, "VENCIDO");
  assert.equal(row.devolucao_vencida, true);
  assert.equal(typeof row.dias_em_atraso, "number");

  const markReturned = await fetchJson(`${baseUrl}/arquivos/${arquivoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      devolvido_em: "2000-01-02",
      devolucao_prevista_em: "2000-01-01",
    }),
  });
  assert.equal(markReturned.res.status, 200);

  const after = await fetchJson(`${baseUrl}/arquivos/${arquivoId}`);
  assert.equal(after.res.status, 200);
  assert.equal(after.json.devolucao_status, "DEVOLVIDO");
  assert.equal(after.json.devolucao_vencida, false);
});
