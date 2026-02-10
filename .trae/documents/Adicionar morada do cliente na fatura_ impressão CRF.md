## Objetivo
- Ao selecionar um cliente, a morada (campo `morada` do cliente) deve aparecer imediatamente na fatura (Sheet CRF), na tela de Nova Requisição e também ao imprimir/exportar.

## Diagnóstico (estado atual)
- A fatura já exibe o endereço via `data.cliente_endereco` em [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx).
- No Formulário da Nova Requisição, ao selecionar cliente, o callback só grava `cliente_id`, `cliente` e `cliente_nif` e **não** grava `cliente_endereco`.
- O modal de seleção de cliente ([SearchInputBox.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SearchInputBox.jsx)) hoje só passa `{nome,id,nif}`, descartando `morada`.

## Mudanças propostas (frontend)
1. **Passar a morada no retorno da seleção de cliente**
   - Ajustar [SearchInputBox.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SearchInputBox.jsx) para chamar `checkedValue(...)` com `morada` (e opcionalmente `telefone/email`, se útil) junto com `id/nome/nif`.
   - No auto-select após cadastrar novo cliente, repassar também `morada`.

2. **Persistir a morada no state do CRF durante a Nova Requisição**
   - Ajustar [FormCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx) no `checkedValue(cliente)` para fazer:
     - `cliente_id`, `cliente`, `cliente_nif`
     - **`cliente_endereco: cliente.morada || ""`**
   - Assim, o `<SheetCrf data={data} />` (preview/print) já passa a renderizar o endereço corretamente.

3. **Mostrar a morada também na tela “Nova Requisição” (form)**
   - Adicionar um campo read-only (ex.: “Morada do Cliente”) no grid do formulário, preenchido a partir de `data.cliente_endereco`.

## Validação (manual)
- Abrir “Nova Requisição”, selecionar um cliente com morada cadastrada e confirmar:
  - O campo “Morada do Cliente” aparece preenchido.
  - A fatura (Sheet CRF) mostra o endereço.
  - Ao imprimir (botão “Imprimir” → “Salvar e Imprimir”), o endereço aparece na impressão.
- Abrir um CRF já salvo (visualização/impressão) e confirmar que continua mostrando `cliente_endereco` normalmente.

## Arquivos que serão alterados
- [FormCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/FormCrf.jsx)
- [SearchInputBox.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SearchInputBox.jsx)

Se você confirmar, eu aplico essas alterações e valido os 3 cenários (nova requisição, fatura/preview e impressão/exportação).