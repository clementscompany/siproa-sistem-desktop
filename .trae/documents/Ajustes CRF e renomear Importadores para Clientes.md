## Escopo (CRF)
1) Atualizar opções do select “Via” para: RODOVIÁRIO, FERROVIÁRIO, MARÍTIMA, AÉREA (salvando como texto no campo `via`).
2) Remover do formulário os campos: Fotocópias, Continuação/Adições, Data Pagamento e Consignatário.
3) No layout impresso/PDF, trocar “A DIREÇÃO REGIONAL DAS ALFANDÉGAS DE CABINDA” por “A DIREÇÃO”.
4) Corrigir dados que somem no PDF (especialmente NIF do cliente): ajustar o layout para usar os nomes corretos vindos do backend (`cliente_nome`, `cliente_nif`, `cliente_endereco`, `origem_nome`, `du_numero`, etc.) e remover `console.log` do template.
5) Recalcular e exibir subtotais e total geral no layout impresso (sem depender de `subtotal1/subtotal2` inexistentes no banco) e adicionar um novo subtotal logo abaixo do item “Modelo O”.
6) Fazer o “Nº CRF (Auto)” aparecer corretamente no PDF/print: exibir `numero_crf` no cabeçalho do documento e ajustar o retorno do `create` no backend para devolver o número gerado (não apenas o payload original).
7) Colocar os dados da empresa (configurações do sistema) no cabeçalho do PDF/print, ao lado do logotipo: buscar via `/getconfig` e renderizar nome/NIF/endereço/telefone/email de forma estruturada.

## Arquivos que serão alterados (CRF)
- [FormCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx): opções de Via; remoção de campos; ajuste do cálculo de totais/subtotais (removendo Fotocópias/Continuações do cálculo e alinhando com o layout impresso).
- [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx): corrigir mapeamento de campos (cliente/nif/endereço/du/origem); adicionar cabeçalho com dados da empresa + número CRF; ajustar subtotais; texto “A DIREÇÃO”.
- [Crf.module.js](file:///c:/projetos/siproa-sistem-desktop/server/database/models/Crf.module.js): no `create`, retornar `numero_crf` gerado (ex.: `CRF-...`) no JSON de resposta.
- (Opcional de robustez) [CrfSheetView.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/crf/CrfSheetView.jsx): ajustar opções do html2pdf/html2canvas para garantir render correto de logo/config (ex.: `useCORS`).

## Escopo (Importadores → Clientes)
8) Renomear a área de “Importadores” para “Clientes” no frontend (títulos, nomes de componentes/arquivos e menu), mantendo a base de dados/endpoints como estão para não quebrar o sistema.
- Atualizar o menu para mostrar “Clientes” e apontar para rotas de clientes.
- Ajustar rotas para manter compatibilidade: `/clientes` como principal e `/importadores` como alias (para não quebrar links atuais).

## Arquivos que serão alterados (Clientes)
- [Importadores.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/importadores/Importadores.jsx) e [FormImportador.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/importadores/FormImportador.jsx): renomear textos e componentes para “Clientes”.
- [Menu.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/Menu/Menu.jsx): trocar “Importadores” por “Clientes” e ajustar submenus/paths.
- [App.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/App.jsx): alinhar rotas (`/clientes` e alias `/importadores`).

## Validação
- Criar um CRF novo, salvar e abrir “Ver” → confirmar que Nº CRF aparece.
- Exportar PDF → confirmar: logo + dados da empresa no cabeçalho; cliente/nif/endereço aparecem; subtotais e total geral batem com os campos.
- Conferir menu/rotas: acessar “Clientes” e cadastrar/editar sem regressões.

Se confirmar, eu aplico as mudanças acima e rodo uma validação rápida na UI (fluxo de criar CRF e exportar PDF).