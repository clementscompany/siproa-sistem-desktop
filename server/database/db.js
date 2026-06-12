import sqlite3 from "sqlite3";
export const DB = new sqlite3.Database("du_system.db");

export const CreateTable = () => {
  DB.serialize(() => {
    // Desliga temporariamente foreign keys
    DB.run(`PRAGMA foreign_keys = OFF;`);

    // -------------------------------
    // PAÍSES
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS paises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        nome TEXT NOT NULL,
        active INTEGER DEFAULT 1
      );
    `);

    // -------------------------------
    // PORTOS / FRONTEIRAS
    // -------------------------------
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

    // -------------------------------
    // UNIDADES
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS unidades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE,
        descricao TEXT NOT NULL,
        active INTEGER DEFAULT 1
      );
    `);

    // -------------------------------
    // TIPOS DOCUMENTO
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS tipos_documento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE,
        descricao TEXT NOT NULL,
        active INTEGER DEFAULT 1
      );
    `);

    // -------------------------------
    // IMPORTADORES
    // -------------------------------
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

    // -------------------------------
    // EXPORTADORES
    // -------------------------------
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

    // -------------------------------
    // REGIMES
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS regimes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT,
        descricao TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    // -------------------------------
    // ADUANAS
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS aduanas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT,
        nome TEXT,
        localizacao TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    // -------------------------------
    // USUÁRIOS
    // -------------------------------
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

    // -------------------------------
    // DESPACHANTES
    // -------------------------------
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

    // -------------------------------
    // MOEDAS (Removido - Campo agora é texto livre em CRF)
    // -------------------------------

    // -------------------------------
    // VIAS
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS vias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT UNIQUE NOT NULL,
        active INTEGER DEFAULT 1
      );
    `);

    // -------------------------------
    // TIPOS CLIENTES
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS tipos_clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE,
        descricao TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    // -------------------------------
    // CONTAS
    // -------------------------------
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

    // -------------------------------
    // TRANSPORTE
    // -------------------------------
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
        FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE,
        FOREIGN KEY (porto_fronteira_id) REFERENCES portos(id) ON DELETE SET NULL
      );
    `);

    // -------------------------------
    // VALORES
    // -------------------------------
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
        FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE CASCADE
      );
    `);

    // -------------------------------
    // CRF
    // -------------------------------
    DB.run(`
  CREATE TABLE IF NOT EXISTS crf (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_crf TEXT UNIQUE NOT NULL,
    req_f TEXT,
    cliente_id INTEGER,
    cliente_nome TEXT,
    cliente_nif TEXT,
    cliente_endereco TEXT,
    via TEXT,
    via_id INTEGER,
    pais_id TEXT,
    pais_nome TEXT,
    data_entrada DATE,
    data_pagamento DATE,
    du_numero TEXT,
    bl_numero TEXT,
    c_marca TEXT,
    crf_ou_f TEXT,
    factura TEXT,
    fob REAL DEFAULT 0,
    frete REAL DEFAULT 0,
    seguro REAL DEFAULT 0,
    cif REAL DEFAULT 0,
    imposto_s_impo REAL DEFAULT 0,
    iva REAL DEFAULT 0,
    imposto_selo REAL DEFAULT 0,
    sobre_taxa REAL DEFAULT 0,
    emolumentos_gerais REAL DEFAULT 0,
    multas_crf REAL DEFAULT 0,
    subtotal REAL DEFAULT 0,
    ep17 REAL DEFAULT 0,
    ep_15 REAL DEFAULT 0,
    ep_14 REAL DEFAULT 0,
    servico_transitario REAL DEFAULT 0,
    veterinario_saude REAL DEFAULT 0,
    validacao_bl REAL DEFAULT 0,
    assistencia REAL DEFAULT 0,
    deslocacao REAL DEFAULT 0,
    honorario REAL DEFAULT 0,
    inerentes REAL DEFAULT 0,
    licenciamento REAL DEFAULT 0,
    declaracao_valor REAL DEFAULT 0,
    modelo0 REAL DEFAULT 0,
    fotocopias REAL DEFAULT 0,
    continuacoes_adicoes REAL DEFAULT 0,
    t_emolument REAL DEFAULT 0,
    total_geral REAL DEFAULT 0,
    total_por_extenso TEXT,
    consignatario TEXT,
    moeda TEXT,
    cambio REAL DEFAULT 1,
    cambio_usd REAL DEFAULT 1,
    valor_aduaneiro REAL DEFAULT 0,
    designacao TEXT,
    observacoes TEXT,
    estado_pagamento TEXT DEFAULT 'PENDENTE',
    referencia_bancaria TEXT,
    active INTEGER DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES importadores(id) ON DELETE SET NULL,
    FOREIGN KEY (via_id) REFERENCES vias(id) ON DELETE SET NULL
  );
`);

    DB.run(`CREATE INDEX IF NOT EXISTS idx_crf_numero ON crf(numero_crf);`);
    DB.run(`CREATE INDEX IF NOT EXISTS idx_crf_cliente ON crf(cliente_id);`);
    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_crf_estado ON crf(estado_pagamento);`,
    );

    // -------------------------------
    // CRF ITENS
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS crf_itens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crf_id INTEGER NOT NULL,
        descricao TEXT NOT NULL,
        valor REAL DEFAULT 0,
        tipo TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (crf_id) REFERENCES crf(id) ON DELETE CASCADE
      );
    `);

    // -------------------------------
    // ARQUIVOS (PROCESSOS DOS CLIENTES)
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS arquivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        numero_du TEXT,
        numero_do_processo TEXT,
        descricao_da_mercadooria TEXT,
        situacao TEXT DEFAULT 'PENDENTE',
        observacao TEXT,
        doc_transporte TEXT,
        guia_contratacao TEXT,
        numero_lote TEXT,
        documento_em_falta TEXT,
        status TEXT DEFAULT 'PENDENTE',
        emprestado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        devolucao_prevista_em TEXT,
        prazo_dias INTEGER,
        devolvido_em TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES importadores(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);

    DB.run("ALTER TABLE arquivos ADD COLUMN numero_du TEXT", () => {});
    DB.run("ALTER TABLE arquivos ADD COLUMN emprestado_em TEXT", () => {});
    DB.run(
      "ALTER TABLE arquivos ADD COLUMN devolucao_prevista_em TEXT",
      () => {},
    );
    DB.run("ALTER TABLE arquivos ADD COLUMN prazo_dias INTEGER", () => {});
    DB.run("ALTER TABLE arquivos ADD COLUMN devolvido_em TEXT", () => {});

    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_arquivos_cliente ON arquivos(cliente_id);`,
    );
    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_arquivos_status ON arquivos(status);`,
    );
    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_arquivos_situacao ON arquivos(situacao);`,
    );

    // -------------------------------
    // ANEXOS (UPLOADS POR ARQUIVO)
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS anexos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        arquivo_id INTEGER NOT NULL,
        nome_do_arquivo TEXT NOT NULL,
        tipo_de_arquivo TEXT,
        caminho_do_arquivo TEXT NOT NULL,
        tamanho_bytes INTEGER,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (arquivo_id) REFERENCES arquivos(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    DB.run(
      `CREATE INDEX IF NOT EXISTS idx_anexos_arquivo ON anexos(arquivo_id);`,
    );

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

    // -------------------------------
    // MEIOS DE TRANSPORTE
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS meios_transporte (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -------------------------------
    // FORMAS DE PAGAMENTO
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS formas_pagamento (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        descricao TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -------------------------------
    // BANCOS
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS bancos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        codigo TEXT UNIQUE,
        conta_numero TEXT,
        iban TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -------------------------------
    // LOGO APP
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS logo_app (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imagem TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -------------------------------
    // ESTÂNCIAS
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS estancias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        codigo TEXT,
        localizacao TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -------------------------------
    // CÓDIGOS DE EXPORTADOR
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS cod_exportador (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        codigo TEXT UNIQUE NOT NULL,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -------------------------------
    // INE DE EXPORTADOR
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS ine_exportador (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // -------------------------------
    // MORADAS DE EXPORTADOR
    // -------------------------------
    DB.run(`
      CREATE TABLE IF NOT EXISTS moradas_exportador (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        endereco TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Reativa foreign keys
    DB.run(`PRAGMA foreign_keys = ON;`);

    console.log(
      "Banco de dados DU criado com sucesso (todas as tabelas incluindo config e logo_app)!",
    );
  });
};

// Cria as tabelas
CreateTable();
