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

let listener;
let baseUrl;

before(async () => {
  CreateTable();
  await waitForTable("crf");

  await dbRun(
    "INSERT OR IGNORE INTO paises (codigo, nome, active) VALUES (?, ?, 1)",
    ["PT", "Portugal"],
  );

  listener = await new Promise((resolve) => {
    const s = Server.listen(0, "127.0.0.1", () => resolve(s));
  });
  baseUrl = `http://127.0.0.1:${listener.address().port}`;
});

after(() => {
  listener?.close();
});

test("CRUD CRF: criar, obter, atualizar e eliminar (soft delete)", async () => {
  const createBody = {
    req_f: "REQ-TESTE",
    cliente: "Cliente Teste",
    data_entrada: "2026-02-10",
    pais_id: "PT",
    moeda: "EUR",
    fob: 10,
    frete: 1,
    seguro: 2,
    imposto_s_impo: 3,
    iva: 4,
    imposto_selo: 5,
    sobre_taxa: 6,
    emolumentos_gerais: 7,
    multas_crf: 8,
    ep17: 9,
    ep_15: 10,
    ep_14: 11,
    servico_transitario: 12,
  };

  const created = await fetchJson(`${baseUrl}/crf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(createBody),
  });
  assert.equal(created.res.status, 201);
  assert.equal(typeof created.json?.id, "number");
  assert.ok(created.json?.numero_crf);

  const id = created.json.id;

  const got = await fetchJson(`${baseUrl}/crf/${id}`);
  assert.equal(got.res.status, 200);
  assert.equal(got.json?.id, id);

  const updated = await fetchJson(`${baseUrl}/crf/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...createBody,
      req_f: "REQ-TESTE-EDITADO",
      pais_id: "PT",
    }),
  });
  assert.equal(updated.res.status, 200);
  assert.equal(updated.json?.affected, 1);

  const deleted = await fetchJson(`${baseUrl}/crf/${id}`, { method: "DELETE" });
  assert.equal(deleted.res.status, 200);
  assert.equal(deleted.json?.affected, 1);

  const list = await fetchJson(`${baseUrl}/crf`);
  assert.equal(list.res.status, 200);
  assert.ok(Array.isArray(list.json));
  assert.equal(
    list.json.some((row) => row.id === id),
    false,
    "CRF eliminada (active=0) não deve aparecer no GET /crf",
  );
});

test("CRUD CRF: update/delete retornam 404 quando não existir", async () => {
  const updateMissing = await fetchJson(`${baseUrl}/crf/99999999`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ req_f: "X" }),
  });
  assert.equal(updateMissing.res.status, 404);

  const deleteMissing = await fetchJson(`${baseUrl}/crf/99999999`, {
    method: "DELETE",
  });
  assert.equal(deleteMissing.res.status, 404);
});

