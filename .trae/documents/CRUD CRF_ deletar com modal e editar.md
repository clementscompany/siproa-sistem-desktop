## Objetivo
- Finalizar o CRUD de CRF: **Deletar** (com confirmação via modal customizado, sem `alert` nativo) e **Editar** (com tela/página dedicada), ajustando **Model** e **Controller** no backend e validando com testes.

## Estado Atual (diagnóstico)
- A listagem funciona em [CRF.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/crf/CRF.jsx) + [TableCRF.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/tables/TableCRF.jsx), mas os botões **Editar/Eliminar** só fazem `console.log`.
- Já existe um modal customizado reutilizável: [Alert.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/Alert/Alert.jsx), usado como confirmação de exclusão em [TableImportadores.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/tables/TableImportadores.jsx).
- Backend já possui rotas `PUT/DELETE /crf/:id`, mas o `update()` no model não trata `pais_id` do mesmo jeito que o `create()` (pode virar `null` quando vem string): [Crf.module.js](file:///c:/projetos/siproa-sistem-desktop/server/database/models/Crf.module.js).

## Frontend: Deletar (com modal customizado)
- Implementar em [TableCRF.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/tables/TableCRF.jsx):
  - Adicionar estados `confirmDelete` e `alertState` (mesmo padrão de [TableImportadores.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/tables/TableImportadores.jsx)).
  - Ao clicar em “Eliminar”, abrir `Alert` com `showCancellButton`.
  - Ao confirmar, chamar `crfApi.delete(item.id)`, mostrar sucesso/erro via `Alert` e **recarregar** a tabela.

## Frontend: Editar (página dedicada)
- Criar uma rota de edição no router:
  - Atualizar [App.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/App.jsx) para incluir algo como `/crf/:id/editar`.
- Criar uma nova página em `pages/crf` (ex.: `EditarCrf.jsx`):
  - Ler `id` via `useParams()`.
  - Renderizar o mesmo formulário [FormCrf (FormDataCRF)](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx) em modo edição.
  - Ao fechar/cancelar, navegar para `/crf`.
- Alterar o botão “Editar” em [TableCRF.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/tables/TableCRF.jsx) para navegar para a rota de edição.

## Formulário: suportar Create e Update com a mesma lógica
- Evoluir [FormCrf.jsx (FormDataCRF)](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx):
  - Aceitar prop opcional `crfId` (ou `mode="edit"`).
  - Quando `crfId` existir, carregar `crfApi.getById(crfId)` e popular o estado `data` + labels (`clientSelected`, `paisSelected`).
  - Ajustar `handleSave()`:
    - `create` quando não houver `crfId`.
    - `update` quando houver `crfId`.
  - Tornar o consumo da API resiliente a respostas `raw` vs `{ success, data }` (sem quebrar o fluxo atual): usar `result.data ?? result`.

## Backend: Ajustes em Model e Controller (CRF)
- Controller [crf.controller.js](file:///c:/projetos/siproa-sistem-desktop/server/controllers/crf/crf.controller.js):
  - Padronizar retorno para ficar no mesmo estilo de `clients` (retorno direto do objeto/resultado, e `201` no create).
  - Em `update/delete`, se `affected === 0`, retornar `404` (não encontrado).
- Model [Crf.module.js](file:///c:/projetos/siproa-sistem-desktop/server/database/models/Crf.module.js):
  - Replicar a lógica do `create()` para `pais_id` também no `update()`:
    - aceitar número, string numérica e código (`"PT"`, etc.) e tentar resolver na tabela `paises` quando aplicável.

## Testes (automatizados + verificação prática)
- Adicionar testes de integração do backend usando `node:test` (sem bibliotecas novas):
  - Subir o Express `Server` exportado em [server/index.js](file:///c:/projetos/siproa-sistem-desktop/server/index.js) em porta aleatória.
  - Rodar `CreateTable()` para garantir schema.
  - Cenários: `POST /crf` → `GET /crf/:id` → `PUT /crf/:id` → `DELETE /crf/:id` → confirmar que não aparece mais em `GET /crf`.
  - Cobrir também `pais_id` como string (quando existir país no banco).
- Verificação no app:
  - Confirmar que “Eliminar” abre o **Alert customizado** e recarrega a lista.
  - Confirmar que “Editar” abre a página de edição, carrega dados e salva via `PUT`.

## Arquivos que serão afetados
- Frontend: [TableCRF.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/tables/TableCRF.jsx), [App.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/App.jsx), novo `pages/crf/EditarCrf.jsx`, e ajustes em [FormCrf.jsx (FormDataCRF)](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx).
- Backend: [crf.controller.js](file:///c:/projetos/siproa-sistem-desktop/server/controllers/crf/crf.controller.js), [Crf.module.js](file:///c:/projetos/siproa-sistem-desktop/server/database/models/Crf.module.js).
- Testes: novo(s) arquivo(s) em `server/tests` (ou pasta similar) e script `test` no `package.json` para executar `node --test`.