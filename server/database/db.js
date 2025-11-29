import sqlite3 from "sqlite3";
export const DB = new sqlite3.Database("du_system.db");

const CreateTable = () => {
  // ================================
  // IMPORTADORES
  // ================================
  const importadores = `
    CREATE TABLE IF NOT EXISTS importadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT UNIQUE NOT NULL,
      nome TEXT NOT NULL,
      nif TEXT,
      morada TEXT,
      nacionalidade TEXT,
      telefone TEXT,
      email TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  DB.run(importadores);

  // ================================
  // REGIMES
  // ================================
  const regimes = `
    CREATE TABLE IF NOT EXISTS regimes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      descricao TEXT
    );
  `;
  DB.run(regimes);

  // ================================
  // ADUANAS
  // ================================
  const aduanas = `
    CREATE TABLE IF NOT EXISTS aduanas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT,
      nome TEXT,
      localizacao TEXT
    );
  `;
  DB.run(aduanas);

  // ================================
  // USUÁRIOS DO SISTEMA
  // ================================
  const usuarios = `
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
  `;
  DB.run(usuarios);

  // ================================
  // DESPACHANTES
  // ================================
  const despachantes = `
    CREATE TABLE IF NOT EXISTS despachantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      nif TEXT,
      telefone TEXT,
      email TEXT,
      numero_licenca TEXT,
      morada TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  DB.run(despachantes);

  // ================================
  // CONTAS
  // ================================
  const contas = `
    CREATE TABLE IF NOT EXISTS contas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_conta TEXT UNIQUE NOT NULL,
      importador_id INTEGER,
      regime_id INTEGER,
      aduana_id INTEGER,
      despachante_id INTEGER,
      exportador TEXT,
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
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (importador_id) REFERENCES importadores(id),
      FOREIGN KEY (regime_id) REFERENCES regimes(id),
      FOREIGN KEY (aduana_id) REFERENCES aduanas(id),
      FOREIGN KEY (despachante_id) REFERENCES despachantes(id)
    );
  `;
  DB.run(contas);

  // ================================
  // TRANSPORTE
  // ================================
  const transporte = `
    CREATE TABLE IF NOT EXISTS transporte (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      tipo TEXT,
      meio_transporte TEXT,
      regiao_transporte TEXT,
      manifesto_numero TEXT,
      doc_transporte TEXT,
      porto_fronteira TEXT,
      municipio_origem TEXT,
      data_chegada DATE,
      data_partida DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(transporte);

  // ================================
  // VALORES
  // ================================
  const valores = `
    CREATE TABLE IF NOT EXISTS valores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(valores);

  // ================================
  // ADIÇÕES (itens de conta)
  // ================================
  const adicoes = `
    CREATE TABLE IF NOT EXISTS adicoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      numero_adicao INTEGER NOT NULL,
      artigo_pautal TEXT,
      descricao_produto TEXT,
      quantidade REAL DEFAULT 0,
      unidade TEXT,
      valor_unitario REAL DEFAULT 0,
      total_fob REAL DEFAULT 0,
      total_cif REAL DEFAULT 0,
      frete REAL DEFAULT 0,
      regime TEXT,
      peso_bruto REAL,
      peso_liquido REAL,
      moeda TEXT,
      cambio REAL,
      cod_procedimento TEXT,
      pais_origem TEXT,
      pais_procedencia TEXT,
      pais_expedicao TEXT,
      direitos_taxas REAL DEFAULT 0,
      licenca_numero TEXT,
      unidade_suplementar TEXT,
      marca TEXT,
      modelo TEXT,
      ano_fabricacao INTEGER,
      numero_chassis TEXT,
      numero_motor TEXT,
      observacoes TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(adicoes);

  // ================================
  // MERCADORIAS
  // ================================
  const mercadorias = `
    CREATE TABLE IF NOT EXISTS mercadorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adicao_id INTEGER,
      tipo TEXT,
      categoria TEXT,
      descricao TEXT,
      quantidade REAL,
      unidade TEXT,
      peso_liquido REAL,
      peso_bruto REAL,
      valor_unitario REAL,
      total REAL,
      pais_origem TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (adicao_id) REFERENCES adicoes(id)
    );
  `;
  DB.run(mercadorias);

  // ================================
  // FATURAS
  // ================================
  const faturas = `
    CREATE TABLE IF NOT EXISTS faturas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      numero_fatura TEXT NOT NULL,
      data_emissao DATE,
      data_vencimento DATE,
      fornecedor TEXT,
      valor_total REAL DEFAULT 0,
      moeda TEXT,
      cambio REAL,
      descricao TEXT,
      caminho_anexo TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(faturas);

  // ================================
  // POSIÇÕES DA FATURA
  // ================================
  const posicao_fatura = `
    CREATE TABLE IF NOT EXISTS posicao_fatura (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fatura_id INTEGER,
      adicao_id INTEGER,
      quantidade REAL DEFAULT 0,
      valor_unitario REAL DEFAULT 0,
      total REAL DEFAULT 0,
      descricao TEXT,
      FOREIGN KEY (fatura_id) REFERENCES faturas(id),
      FOREIGN KEY (adicao_id) REFERENCES adicoes(id)
    );
  `;
  DB.run(posicao_fatura);

  // ================================
  // PAGAMENTOS DAS FATURAS
  // ================================
  const faturas_pagamentos = `
    CREATE TABLE IF NOT EXISTS faturas_pagamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fatura_id INTEGER,
      metodo_pagamento TEXT,
      banco TEXT,
      numero_recibo TEXT,
      valor_pago REAL,
      data_pagamento DATE,
      status TEXT DEFAULT 'pendente',
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fatura_id) REFERENCES faturas(id)
    );
  `;
  DB.run(faturas_pagamentos);

  // ================================
  // POSIÇÕES (controle de etapas DU)
  // ================================
  const posicoes = `
    CREATE TABLE IF NOT EXISTS posicoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      descricao TEXT,
      etapa TEXT,
      responsavel TEXT,
      data_inicio DATE,
      data_fim DATE,
      status TEXT DEFAULT 'em_andamento',
      observacao TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(posicoes);

  // ================================
  // AVALIAÇÃO
  // ================================
  const avaliacao = `
    CREATE TABLE IF NOT EXISTS avaliacao (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      metodo_avaliacao TEXT,
      tda TEXT,
      monotran TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(avaliacao);

  // ================================
  // DOCUMENTOS
  // ================================
  const documentos = `
    CREATE TABLE IF NOT EXISTS documentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      tipo TEXT,
      numero TEXT,
      emissor TEXT,
      data_emissao DATE,
      data_validade DATE,
      caminho TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(documentos);

  // ================================
  // ANEXOS
  // ================================
  const anexos = `
    CREATE TABLE IF NOT EXISTS anexos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      tipo TEXT,
      nome_arquivo TEXT,
      caminho TEXT,
      tamanho_bytes INTEGER,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(anexos);
  // ================================
  // LOGS
  // ================================
  const logs_conta = `
    CREATE TABLE IF NOT EXISTS logs_conta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      acao TEXT,
      usuario TEXT,
      detalhe TEXT,
      ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conta_id) REFERENCES contas(id)
    );
  `;
  DB.run(logs_conta);

  const empresas = `
    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conta_id INTEGER,
      nome TEXT,
      nif TEXT,
      endereco TEXT,
      email TEXT,
      telefone TEXT,
      cedula TEXT,
      interno INT DEFAULT 0,
      active INT DEFAULT 1,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  DB.run(empresas);

  // ================================
  // CONFIGURAÇÕES DO SISTEMA
  // ================================

  const config = `
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
  `;
  DB.run(config);

  console.log("Base de dados DU criada com sucesso com todas as tabelas!");
};

export { CreateTable };
