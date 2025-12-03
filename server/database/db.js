import sqlite3 from "sqlite3";
export const DB = new sqlite3.Database("du_system.db");

const CreateTable = () => {
  DB.serialize(() => {
    // garantir integridade referencial
    DB.run(`PRAGMA foreign_keys = ON;`);

    DB.run(`
      CREATE TABLE IF NOT EXISTS config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_nome TEXT,
      empresa_nif TEXT,
      empresa_endereco TEXT,
      empresa_telefone TEXT,
      empresa_cedula TEXT,
      empresa_email TEXT,
      admin_usuario TEXT,
      admin_email TEXT DEFAULT NULL,
      admin_senha TEXT DEFAULT NULL,
      admin_confirmar TEXT,
      moeda_padrao TEXT,
      taxa_cambio VARCHAR(10) DEFAULT '1',
      unidade_padrao TEXT,
      tema TEXT,
      idioma TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================================
    // PAÍSES
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS paises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        active INTEGER DEFAULT 1
      );
    `);

    // ================================
    // PORTOS / FRONTEIRAS
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS portos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT,
        nome TEXT NOT NULL,
        tipo TEXT,
        localizacao TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    // ================================
    // UNIDADES
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS unidades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE,
        descricao TEXT NOT NULL,
        active INTEGER DEFAULT 1
      );
    `);

    // ================================
    // TIPOS DE DOCUMENTO
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS tipos_documento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE,
        descricao TEXT NOT NULL,
        active INTEGER DEFAULT 1
      );
    `);

    // ================================
    // IMPORTADORES
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS importadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        nif TEXT,
        morada TEXT,
        nacionalidade TEXT,
        telefone TEXT,
        email TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================================
    // EXPORTADORES
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS exportadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        nif TEXT,
        morada TEXT,
        nacionalidade TEXT,
        telefone TEXT,
        email TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================================
    // REGIMES
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS regimes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT,
        descricao TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    // ================================
    // ADUANAS
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS aduanas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT,
        nome TEXT,
        localizacao TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    // ================================
    // USUÁRIOS
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        perfil TEXT DEFAULT 'operador',
        email TEXT,
        telefone TEXT,
        ativo INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================================
    // DESPACHANTES
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS despachantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        nif TEXT,
        telefone TEXT,
        email TEXT,
        numero_licenca TEXT,
        morada TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ================================
    // CONTAS (DU)
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS contas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo_conta TEXT UNIQUE,
        importador_id INTEGER,
        exportador_id INTEGER,
        regime_id INTEGER,
        aduana_id INTEGER,
        despachante_id INTEGER,
        data_abertura DATE,
        data_entrada DATE,
        data_pagamento DATE,
        fob REAL DEFAULT 0,
        cif REAL DEFAULT 0,
        frete REAL DEFAULT 0,
        valor_aduaneiro REAL DEFAULT 0,
        cambio REAL DEFAULT 1,
        moeda TEXT DEFAULT 'AOA',
        manifest_numero TEXT,
        doc_transporte TEXT,
        registo_transporte TEXT,
        valor_a_pagar_du REAL DEFAULT 0,
        subtotal REAL DEFAULT 0,
        total REAL DEFAULT 0,
        status TEXT DEFAULT 'aberta',
        observacoes TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (importador_id) REFERENCES importadores(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (exportador_id) REFERENCES exportadores(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (regime_id) REFERENCES regimes(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (aduana_id) REFERENCES aduanas(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (despachante_id) REFERENCES despachantes(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    // índices contas
    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_contas_importador ON contas(importador_id);`,
    );
    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_contas_exportador ON contas(exportador_id);`,
    );
    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_contas_regime ON contas(regime_id);`,
    );
    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_contas_aduana ON contas(aduana_id);`,
    );

    // ================================
    // TRANSPORTE
    // ================================
    DB.run(`
      CREATE TABLE IF NOT EXISTS transporte (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conta_id INTEGER NOT NULL,
        tipo TEXT,
        meio_transporte TEXT,
        regiao_transporte TEXT,
        manifesto_numero TEXT,
        doc_transporte TEXT,
        porto_fronteira_id INTEGER,
        municipio_origem TEXT,
        data_chegada DATE,
        data_partida DATE,
        active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (porto_fronteira_id) REFERENCES portos(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    // ================================
    // Restante das tabelas (valores, adicoes, mercadorias, faturas, posicoes, avaliacao, documentos, anexos, logs, empresas, pauta)
    // ================================
    // Seguir mesmo padrão: adicionar active INTEGER DEFAULT 1 nas tabelas que podem ser "desativadas" e manter FOREIGN KEY consistente.

    // exemplo: tabela valores
    DB.run(`
      CREATE TABLE IF NOT EXISTS valores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conta_id INTEGER NOT NULL,
        cambio_dsd REAL,
        cambio_moeda REAL,
        estatistica TEXT,
        soma REAL DEFAULT 0,
        peso_bruto REAL,
        peso_liquido REAL,
        fiscalizacao_porte REAL,
        numero_volumes INTEGER,
        base_liquida REAL,
        forma_pagamento TEXT,
        detalhes_banco TEXT,
        imposto_s REAL DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    console.log(
      "Base de dados DU criada/atualizada com sucesso (versão final corrigida)!",
    );
  });
};

export { CreateTable };
