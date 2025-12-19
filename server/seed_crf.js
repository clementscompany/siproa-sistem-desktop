import { DB } from "./database/db.js";

const crfs = [
  {
    numero_crf: "CRF-2025-001",
    cliente_id: 1,
    cliente_nome: "TransLog Angola", // Redundant but stored
    req_f: "REQ-001",
    data_entrada: "2024-12-01",
    data_pagamento: "2024-12-10",
    total_geral: 500000,
    estado_pagamento: "PENDENTE",
    active: 1,
  },
  {
    numero_crf: "CRF-2025-002",
    cliente_id: 2,
    cliente_nome: "Global Export SA",
    req_f: "REQ-002",
    data_entrada: "2024-12-05",
    data_pagamento: "2024-12-15",
    total_geral: 750000,
    estado_pagamento: "PAGO",
    active: 1,
  },
];

DB.serialize(() => {
  const stmt = DB.prepare(`
    INSERT OR IGNORE INTO crf (numero_crf, cliente_id, cliente_nome, req_f, data_entrada, data_pagamento, total_geral, estado_pagamento, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  crfs.forEach((item) => {
    stmt.run(
      item.numero_crf,
      item.cliente_id,
      item.cliente_nome,
      item.req_f,
      item.data_entrada,
      item.data_pagamento,
      item.total_geral,
      item.estado_pagamento,
      item.active,
    );
  });

  stmt.finalize();
  console.log("CRFs inseridos com sucesso!");
});

setTimeout(() => {
  DB.close();
}, 1000);
