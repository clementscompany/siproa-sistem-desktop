import { DB } from "./database/db.js";

// Seed para testar CRF com todos os campos
const crfTest = {
  numero_crf: `CRF-TEST-${Date.now()}`,
  req_f: "REQ-TEST-001",
  cliente_id: 1, // Assumindo que existe pelo menos um importador
  cliente_nome: "Cliente Teste",
  data_entrada: "2025-01-15",
  data_pagamento: "2025-01-20",
  du_numero: "DU-TEST-001",
  bl_numero: "BL-TEST-001",
  c_marca: "MARCA-TEST",
  crf_ou_f: "CRF",
  factura: "FACT-001",
  fob: 10000,
  frete: 500,
  seguro: 200,
  cif: 10700,
  consignatario: "Consignatário Teste",
  pais_id: null, // Não precisa estar no banco
  moeda_id: null,
  cambio: 1,
  cambio_usd: 1,
  valor_aduaneiro: 10700,
  designacao: "Mercadoria de Teste",
  imposto_s_impo: 1000,
  iva: 500,
  imposto_selo: 100,
  sobre_taxa: 50,
  emolumentos_gerais: 200,
  multas_crf: 0,
  subtotal: 1850,
  ep17: 100,
  veterinario_saude: 50,
  validacao_bl: 0,
  assistencia: 75,
  deslocacao: 25,
  honorario: 150,
  inerentes: 30,
  licenciamento: 50,
  declaracao_valor: 25,
  modelo0: 15,
  fotocopias: 10,
  continuacoes_adicoes: 0,
  t_emolument: 100,
  total_geral: 2390, // Removido du_valor (200) do cálculo
  total_por_extenso: "Dois mil e quinhentos e noventa kwanzas",
  observacoes: "CRF de teste criado automaticamente",
  estado_pagamento: "PENDENTE",
  referencia_bancaria: "REF-BANK-001",
  active: 1,
};

DB.serialize(() => {
  const stmt = DB.prepare(`
    INSERT INTO crf (
      numero_crf, req_f, cliente_id, cliente_nome, data_entrada, data_pagamento,
      du_numero, bl_numero, c_marca, crf_ou_f, factura,
      fob, frete, seguro, cif,
      imposto_s_impo, iva, imposto_selo, sobre_taxa, emolumentos_gerais, multas_crf, subtotal,
      ep17, veterinario_saude, validacao_bl, assistencia, deslocacao, honorario, inerentes,
      licenciamento, declaracao_valor, modelo0, fotocopias, continuacoes_adicoes,
      t_emolument, total_geral, total_por_extenso,
      consignatario, pais_id, moeda_id, cambio, cambio_usd, valor_aduaneiro, designacao,
      observacoes, estado_pagamento, referencia_bancaria, active
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  stmt.run(
    crfTest.numero_crf,
    crfTest.req_f,
    crfTest.cliente_id,
    crfTest.cliente_nome,
    crfTest.data_entrada,
    crfTest.data_pagamento,
    crfTest.du_numero,
    crfTest.bl_numero,
    crfTest.c_marca,
    crfTest.crf_ou_f,
    crfTest.factura,
    crfTest.fob,
    crfTest.frete,
    crfTest.seguro,
    crfTest.cif,
    crfTest.imposto_s_impo,
    crfTest.iva,
    crfTest.imposto_selo,
    crfTest.sobre_taxa,
    crfTest.emolumentos_gerais,
    crfTest.multas_crf,
    crfTest.subtotal,
    crfTest.ep17,
    crfTest.veterinario_saude,
    crfTest.validacao_bl,
    crfTest.assistencia,
    crfTest.deslocacao,
    crfTest.honorario,
    crfTest.inerentes,
    crfTest.licenciamento,
    crfTest.declaracao_valor,
    crfTest.modelo0,
    crfTest.fotocopias,
    crfTest.continuacoes_adicoes,
    crfTest.t_emolument,
    crfTest.total_geral,
    crfTest.total_por_extenso,
    crfTest.consignatario,
    crfTest.pais_id,
    crfTest.moeda_id,
    crfTest.cambio,
    crfTest.cambio_usd,
    crfTest.valor_aduaneiro,
    crfTest.designacao,
    crfTest.observacoes,
    crfTest.estado_pagamento,
    crfTest.referencia_bancaria,
    crfTest.active,
  );

  stmt.finalize();
  console.log("✅ CRF de teste criado com sucesso!");
  console.log("Número CRF:", crfTest.numero_crf);
});

// Close DB connection after a short delay
setTimeout(() => {
  DB.close();
}, 1000);
