import { DB } from "./database/db.js";

const clients = [
  {
    codigo: "IMP-001",
    nome: "TransLog Angola",
    nif: "5001234567",
    morada: "Viana - Zona Industrial",
    nacionalidade: "Angolana",
    telefone: "+244 923 456 789",
    email: "contato@translog.co.ao"
  },
  {
    codigo: "IMP-002",
    nome: "Global Export SA",
    nif: "5407789901",
    morada: "Lobito - Restinga",
    nacionalidade: "Angolana",
    telefone: "+244 938 890 223",
    email: "geral@globalexport.com"
  },
  {
    codigo: "IMP-003",
    nome: "Aduana Express",
    nif: "5012298845",
    morada: "Luanda - Ingombotas",
    nacionalidade: "Angolana",
    telefone: "+244 912 334 556",
    email: "info@aduanaexpress.ao"
  }
];

DB.serialize(() => {
  const stmt = DB.prepare(`
    INSERT OR IGNORE INTO importadores (codigo, nome, nif, morada, nacionalidade, telefone, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  clients.forEach(client => {
    stmt.run(client.codigo, client.nome, client.nif, client.morada, client.nacionalidade, client.telefone, client.email);
  });

  stmt.finalize();
  console.log("Clientes inseridos com sucesso!");
});

// Close DB connection after a short delay to allow operations to finish
setTimeout(() => {
    DB.close();
}, 1000);
