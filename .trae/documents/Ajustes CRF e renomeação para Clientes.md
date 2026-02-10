## Escopo
- Ajustar a área de CRF (formulário + folha/fatura + exportação PDF) e renomear a página de Importadores para Clientes, mantendo compatibilidade de rotas.

## 1) Via (select)
- Conferir e garantir que o select “Via” use exatamente: RODOVIÁRIO, FERROVIÁRIO, MARÍTIMA, AÉREA (com “Selecione” como placeholder) em [FormCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx).

## 2) Remover campos desnecessários
- Como “Fotocópia / Continuação da Adição / Data Pagamento / Consignação” não aparecem hoje no UI do CRF, vou:
  - Garantir que não existam na folha/fatura (Sheet) e não sejam exibidos.
  - Parar de depender desses campos no fluxo de CRF (não vou alterar a estrutura do SQLite para evitar migração destrutiva; apenas remover uso/expectativa no front/back onde fizer sentido).

## 3) Texto na fatura
- Trocar “A DIREÇÃO REGIONAL DAS ALFANDÉGAS DE CABINDA” por “A DIREÇÃO” no rodapé da folha/fatura em [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx) e reposicionar fora da tabela (hoje está quebrando o HTML).

## 4) Dados da empresa e NIF do cliente no PDF
- Corrigir o componente [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx) (ele está truncado e com erro de sintaxe) para:
  - Recriar o final do arquivo e fechar corretamente tabela/JSX.
  - Adicionar o state ausente `company` e carregar config/logo via `systemApi`.
  - Garantir render consistente no export (imagem com `crossOrigin="anonymous"` e tratamento para logo em URL absoluta/data URL quando necessário).
- Ajustar a exportação em [CrfSheetView.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/crf/CrfSheetView.jsx) para capturar o DOM já “pronto”:
  - Esperar fonts/imagens carregarem antes de chamar `html2pdf`.
  - Habilitar `html2canvas: { scale: 2, useCORS: true, allowTaint: true }`.
- Garantir que o NIF do cliente exista também quando a folha é renderizada a partir do formulário (antes de salvar):
  - Passar `nif` ao selecionar cliente em [SearchInputBox.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SearchInputBox.jsx).
  - Armazenar `cliente_nif` no state do CRF em [FormCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx) e usar fallback no Sheet.

## 5) Subtotais e Total Geral (e novo subtotal após “Modelo O”)
- Ajustar a fatura para ter subtotais coerentes por grupos e adicionar mais um subtotal após “Modelo O”:
  - Subtotal 1: (Imposto/IVA/Selo/Sobre taxa/Emolumentos/Multas)
  - Subtotal 2: (EP17/EP15/EP14/Vet/Validação/Deslocação/Serviço Transitário)
  - Subtotal 3: (Honorário/Inerentes/Licenciamento/Declaração/Modelo O)
  - Total Geral: soma dos 3 subtotais
- Implementar esses cálculos diretamente na [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx) para não depender de campos inexistentes (`subtotal1/subtotal2` hoje não vêm do backend).

## 6) Número automático do CRF não aparece
- Após salvar, preencher imediatamente o “Nº CRF (Auto)” no formulário com o `numero_crf` retornado pelo backend em [FormCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx).
- Corrigir o wrapper [pages/crf/FormCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/crf/FormCrf.jsx) para repassar `onSaved` (hoje o `CRF.jsx` envia, mas o wrapper ignora).

## 7) Dados da empresa no cabeçalho ao lado do logotipo
- Estruturar o cabeçalho na [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx) com:
  - Logo à esquerda
  - Dados da empresa (configurações) ao lado, bem alinhados
  - Bloco à direita com CRF Nº e Data

## 8) Renomear Importadores → Clientes (páginas)
- Renomear o conteúdo de [pages/importadores](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/importadores) para “Clientes” de forma consistente:
  - Ajustar nomes de componentes/exports/imports em [Importadores.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/importadores/Importadores.jsx) e [FormImportador.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/pages/importadores/FormImportador.jsx).
  - Atualizar imports em [App.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/App.jsx) e [SearchInputBox.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SearchInputBox.jsx).
  - Manter as rotas antigas `/importadores` como alias (já existem), além de `/clientes`.

## Verificação
- Validar manualmente:
  - Form CRF: Via com 4 opções; número CRF aparece após salvar.
  - Folha/Export PDF: dados da empresa + NIF do cliente aparecem; rodapé “A DIREÇÃO”; subtotais e total geral batem.
  - Página Clientes: textos/nomes consistentes; busca/cadastro continuam funcionando.