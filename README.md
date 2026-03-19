# siproa

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/51ad1132-1244-40e9-abcc-1e2138d6c32f" />

```sh
# Campos do formulario

    CREATE TABLE IF NOT EXISTS crf (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_crf TEXT UNIQUE NOT NULL,
        numero_auto_crf INTEGER,
        req_f TEXT,
        tipo_cliente_id INTEGER,
        cliente_id INTEGER,
        cliente_nome TEXT,
        cliente_nif TEXT,
        via_id INTEGER,
        conta_id INTEGER,
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
        consignatario TEXT,
        pais_id INTEGER,
        moeda_id INTEGER,
        cambio REAL DEFAULT 1,
        cambio_usd REAL DEFAULT 1,
        valor_aduaneiro REAL DEFAULT 0,
        designacao TEXT,
        imposto_s_impo REAL DEFAULT 0,
        iva REAL DEFAULT 0,
        imposto_selo REAL DEFAULT 0,
        sobre_taxa REAL DEFAULT 0,
        emolumentos_gerais REAL DEFAULT 0,
        multas_crf REAL DEFAULT 0,
        subtotal REAL DEFAULT 0,
        ep17 REAL DEFAULT 0,
        veterinario_saude REAL DEFAULT 0,
        validacao_bl INTEGER DEFAULT 0,
        assistencia REAL DEFAULT 0,
        deslocacao REAL DEFAULT 0,
        honorario REAL DEFAULT 0,
        inerentes REAL DEFAULT 0,
        licenciamento REAL DEFAULT 0,
        declaracao_valor REAL DEFAULT 0,
        modelo0 REAL DEFAULT 0,
        fotocopias REAL DEFAULT 0,
        t_emolument REAL DEFAULT 0,
        continuacoes_adicoes REAL DEFAULT 0,
        total_geral REAL DEFAULT 0,
        total_por_extenso TEXT,
        observacoes TEXT,
        estado_pagamento TEXT DEFAULT 'PENDENTE',
        referencia_bancaria TEXT,
        active INTEGER DEFAULT 1,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        criado_por INTEGER,
        atualizado_por INTEGER,
        FOREIGN KEY (cliente_id) REFERENCES importadores(id) ON DELETE SET NULL,
        FOREIGN KEY (via_id) REFERENCES vias(id) ON DELETE SET NULL,
        FOREIGN KEY (pais_id) REFERENCES paises(id) ON DELETE SET NULL,
        FOREIGN KEY (moeda_id) REFERENCES moedas(id) ON DELETE SET NULL,
        FOREIGN KEY (tipo_cliente_id) REFERENCES tipos_clientes(id) ON DELETE SET NULL,
        FOREIGN KEY (conta_id) REFERENCES contas(id) ON DELETE SET NULL


```


