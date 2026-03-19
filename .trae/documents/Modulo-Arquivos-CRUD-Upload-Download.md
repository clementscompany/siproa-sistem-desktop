## Objetivo
- Criar o novo módulo **ARQUIVOS** para guardar processos dos clientes e seus anexos, com CRUD completo e suporte a upload/listagem/download/exclusão.

## Banco de dados (SQLite)
- Adicionar no [db.js](file:///c:/projetos/siproa-sistem-desktop/server/database/db.js) as tabelas:
  - **arquivos**
    - `id INTEGER PRIMARY KEY AUTOINCREMENT`
    - `cliente_id INTEGER` (FK para a tabela de clientes já existente no projeto; será usado o mesmo fluxo/modal de cliente do CRF)
    - `numero_do_processo TEXT`
    - `descricao_da_mercadoia TEXT`
    - `situacao TEXT DEFAULT 'PENDENTE'`
    - `observacao TEXT`
    - `doc_transporte TEXT`
    - `guia_contratacao TEXT`
    - `numero_lote TEXT`
    - `documento_em_falta TEXT`
    - `numero_de_certificado TEXT`
    - `status TEXT DEFAULT 'PENDENTE'`
    - `active INTEGER DEFAULT 1`, `criado_em`, `atualizado_em` (seguindo padrão do projeto para soft delete/auditoria)
  - **anexos**
    - `id INTEGER PRIMARY KEY AUTOINCREMENT`
    - `arquivo_id INTEGER` (FK para `arquivos`)
    - `nome_do_arquivo TEXT`
    - `tipo_de_arquivo TEXT`
    - `caminho_do_arquivo TEXT`
    - `tamanho_bytes INTEGER`, `criado_em` (metadados úteis para listagem)
- Criar índices (ex.: `idx_arquivos_cliente_id`, `idx_anexos_arquivo_id`) para performance.

## Backend (Express)
- Seguir o padrão do CRF (rotas → controller → module de banco):
  - Criar `server/database/models/Arquivos.module.js` com:
    - `getAll({cliente_id, status, situacao, q})` (filtros por cliente, texto e status)
    - `getById(id)` (inclui dados do cliente e lista de anexos)
    - `create(data)`
    - `update(id, data)`
    - `delete(id)` (soft delete com `active = 0`)
  - Criar `server/database/models/Anexos.module.js` com:
    - `listByArquivoId(arquivoId)`
    - `create({arquivo_id, nome, tipo, caminho, tamanho})`
    - `delete(id)` (remove do DB e retorna `caminho_do_arquivo` para remover do disco)
    - `getById(id)` (para download)
  - Criar controllers:
    - `server/controllers/arquivos/arquivos.controller.js`
    - `server/controllers/anexos/anexos.controller.js`
- Rotas em [Routes.js](file:///c:/projetos/siproa-sistem-desktop/server/Routes.js) (padrão REST):
  - `GET /arquivos`
  - `GET /arquivos/:id`
  - `POST /arquivos`
  - `PUT /arquivos/:id`
  - `DELETE /arquivos/:id`
  - `GET /arquivos/:id/anexos`
  - `POST /arquivos/:id/anexos` (upload)
  - `DELETE /anexos/:id`
  - `GET /anexos/:id/download`
- Upload/armazenamento:
  - Reutilizar `server/middlewares/upload.js` (multer) e salvar em `server/uploads/arquivos/<arquivoId>/`.
  - Persistir em `anexos.caminho_do_arquivo` o caminho relativo para permitir download sem depender do nome original.
  - Validar tipo/tamanho (limite razoável), e bloquear path traversal no download.

## Frontend (React/Electron)
- Criar API clients:
  - `src/renderer/src/api/Arquivos.api.js` e `src/renderer/src/api/Anexos.api.js` no mesmo padrão de [Crf.api.js](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/api/Crf.api.js)
- Criar rotas/telas:
  - Adicionar rota `#/arquivos` no [App.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/App.jsx)
  - Página `src/renderer/src/pages/arquivos/ARQUIVOS.jsx` com:
    - tabela/listagem (buscar, filtrar por cliente/status)
    - botões: Novo, Editar, Ver, Excluir
- Criar componentes/modais ("bodais"):
  - Modal **Criar/Editar Arquivo** (formulário)
    - Campo de **cliente** com o mesmo padrão do CRF: usar o componente de busca/seleção já existente (ex.: [SearchInputBox.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SearchInputBox.jsx)) e manter o modal de **criar/listar clientes** igual ao do CRF.
  - Modal **Detalhes do Arquivo**
    - Exibir dados do processo
    - Listar anexos
    - Botão **Upload** (input file) para anexar
    - Ações por anexo: **Download** e **Excluir**
  - Modal **Confirmação de exclusão** (reuso do padrão do CRF com `Alert`)
- Download no Electron:
  - Ao clicar em Download, chamar endpoint `/anexos/:id/download` e salvar via Blob (no renderer) com nome original.

## Validação / Testes
- Criar testes de rotas no backend no padrão de `server/tests/crf.routes.test.js`:
  - CRUD de arquivos
  - upload de anexo
  - listagem e download de anexo
  - delete de anexo (remove DB + arquivo do disco)
- Rodar a suíte de testes e validar manualmente a UI (criar → anexar → listar → baixar → excluir).

## Observações de compatibilidade
- A referência `cliente_id` vai apontar para a tabela de clientes já existente no projeto (hoje há módulo de clientes no backend). O frontend reutiliza o mesmo fluxo/modal usado no CRF para selecionar/cadastrar cliente.