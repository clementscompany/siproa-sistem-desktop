## Diagnóstico rápido
- O cabeçalho do PDF/print do CRF já está puxando os dados do `/getconfig` e exibindo ao lado do logotipo em [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx#L126-L140), com fonte reduzida (10px no documento e 9.5px no bloco do cabeçalho).

## O que vou ajustar agora (sem mudar regra de negócio)
### 1) Cabeçalho mais “estruturado” ao lado do logotipo
- Trocar o layout do cabeçalho para um bloco mais compacto e consistente (tipo “tabela/grid”), com:
  - Linha 1: Nome da empresa (negrito)
  - Linha 2: NIF | Cédula (se existir)
  - Linha 3: Endereço
  - Linha 4: Tel | Email
- Garantir alinhamento e espaçamento para não “quebrar” em 2 folhas.

### 2) Reduzir ainda mais o tamanho do texto do cabeçalho
- Ajustar `font-size` e `line-height` apenas no cabeçalho (sem reduzir o corpo inteiro), e limitar quebras:
  - `font-size` menor (ex.: 8.5–9px)
  - `line-height` ~ 1.05–1.1
  - `gap` menor entre colunas
  - Opcional: cortar/encurtar endereço muito longo para não empurrar conteúdo para outra página.

## Arquivo que será alterado
- [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx)

## Validação
- Exportar PDF de um CRF com logo cadastrado e dados longos (endereço grande) e confirmar:
  - Logo aparece
  - Dados da empresa ficam ao lado do logo e bem alinhados
  - Cabeçalho não empurra a tabela para segunda folha

Se confirmar, aplico o ajuste direto no cabeçalho do [SheetCrf.jsx](file:///c:/projetos/siproa-sistem-desktop/src/renderer/src/components/elements/SheetCrf.jsx).