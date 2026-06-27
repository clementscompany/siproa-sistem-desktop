Claro! Uma checklist deixa a documentação muito mais organizada e facilita acompanhar o progresso. Segue um modelo em **Markdown** usando caixas de seleção (`- [ ]`).

# Checklist de Desenvolvimento do Sistema

> **Status:** Em andamento

---

# Correções

## CRF

* [ ] Corrigir o campo **"CRF ou"**, pois atualmente os dados informados não são gravados.
* [ ] Alterar o rótulo **"CRF ou"** para **"Nº do Processo"** na fatura gerada.

---

## Total por Extenso

* [ ] Corrigir o preenchimento automático do campo **Total por Extenso**.

---

## Fatura

* [ ] Diminuir o tamanho da fonte do conteúdo do cabeçalho da fatura.

---

#  Implementações

## Sistema de Backup

* [ ] Implementar backup manual.
* [ ] Implementar backup automático.
* [ ] Implementar restauração de backup.

---

## Relatórios

### Processos

* [ ] Relatório semanal.
* [ ] Relatório mensal.
* [ ] Relatório anual.

### CRF

* [ ] Relatório semanal.
* [ ] Relatório mensal.
* [ ] Relatório anual.

### Arquivos

* [ ] Relatório semanal.
* [ ] Relatório mensal.
* [ ] Relatório anual.

---

# Módulo de Processos

## Campo: COD. REGIME

* [ ] Alterar para **Select**.

### Opções

* [ ] 11 — Importação Definitiva
* [ ] 12 — Importação Simplificada
* [ ] 13 — Importação Incompleta
* [ ] 14 — Importação Temporária
* [ ] 141 — Importação Temporária
* [ ] 142 — Importação Temporária
* [ ] 143 — Importação Temporária
* [ ] 15 — Re-Importação
* [ ] 151 — Re-Importação
* [ ] 152 — Re-Importação
* [ ] 21 — Exportação Definitiva
* [ ] 23 — Exportação Incompleta
* [ ] 24 — Exportação Temporária
* [ ] 25 — Re-Exportação
* [ ] 41 — Armazém Afiançado
* [ ] 51 — Trânsito Doméstico
* [ ] 61 — Trânsito Internacional

---

## Campo: COD. VOLUME

* [ ] Alterar para **Select**.

### Opções

* [ ] B — Carga a Granel
* [ ] F — Contentor Carregado Cheio
* [ ] G — Carga Geral
* [ ] L — Contentor Carregado Não Cheio
* [ ] N — Números (por unidade)

---

## Campo: MEIO DE TRANSPORTE

* [ ] Alterar para **Select**.

### Opções

* [ ] 11 — Marítimo
* [ ] 12 — Ferroviário
* [ ] 13 — Rodoviário
* [ ] 14 — Aéreo
* [ ] 141 — Postal
* [ ] 142 — Multimodal
* [ ] 143 — Condutas de Transportação Fixa
* [ ] 15 — Transporte Fluvial
* [ ] 151 — Modo de Transporte Não Aplicável

---

## Campo: FORMAS DE PAGAMENTO

* [ ] Alterar para **Select**.

### Opções

* [ ] CA — Pagamento por Adiantamento
* [ ] CD — Pagamento Contra Reembolso
* [ ] LC — Carta de Crédito
* [ ] NR — Não Reembolsável
* [ ] OA — Carta Aberta
* [ ] PP — Pré-Pagamento
* [ ] SD — Pagamento à Vista
* [ ] TT — Transferência Telegráfica

---

## Campo: DETALHE DO BANCO

* [ ] Alterar para **Select**.

### Bancos

* [ ] 0001 — BPC — Banco de Poupança e Crédito
* [ ] 0004 — BCGA — Banco Caixa Geral Angola
* [ ] 0005 — BCI — Banco de Comércio e Indústria
* [ ] 0006 — BFA — Banco de Fomento Angola
* [ ] 0040 — BAI — Banco Angolano de Investimentos
* [ ] 0043 — BNI — Banco de Negócios Internacional
* [ ] 0044 — BCA — Banco Comercial Angolano
* [ ] 0045 — SOL — Banco Sol
* [ ] 0047 — KEVE — Banco Keve
* [ ] 0051 — BIC — Banco BIC
* [ ] 0052 — BMA — Banco Millennium Atlântico
* [ ] 0054 — SBA — Standard Bank Angola
* [ ] 0055 — Banco VTB África
* [ ] 0058 — Banco Económico
* [ ] 0061 — Standard Chartered Bank Angola
* [ ] 0063 — Banco Finibanco Angola
* [ ] 0066 — BIR — Banco de Investimento Rural
* [ ] 0069 — BCS — Banco de Crédito do Sul
* [ ] 0070 — BMF — Banco Micro Finanças

---

# Revisar Funcionalidades

## Importador

* [ ] Ao selecionar um importador, preencher automaticamente:

  * [ ] Nº do Contribuinte
  * [ ] Morada
  * [ ] INE

> **Observação:** O campo **INE** continua sendo informado manualmente no cadastro.

---

## Exportador

* [ ] Aplicar o mesmo comportamento do Importador:

  * [ ] Nº do Contribuinte
  * [ ] Morada
  * [ ] INE

---

# Pendências

## Portos

* [ ] Adicionar mais Portos de Entrada.
* [ ] Adicionar mais Portos de Saída.
* [ ] Adicionar mais Locais de Embarque.

---

## Estância

* [ ] Revisar implementação (informações serão fornecidas pelo contabilista).

---

## Método de Avaliação

* [ ] Revisar implementação (informações serão fornecidas pelo contabilista).

---

# 📊 Relatórios Gerenciais

## CRF

* [ ] Total semanal.
* [ ] Total mensal.
* [ ] Total anual.

## Processos

* [ ] Total semanal.

* [ ] Total mensal.

* [ ] Total anual.

* [ ] Gerar documento consolidado com os indicadores.

---

# Prioridades

## Alta Prioridade

* [ ] Correção do campo **CRF ou**.
* [ ] Correção do **Total por Extenso**.
* [ ] Ajuste do cabeçalho da fatura.
* [ ] Implementação dos campos Select do módulo Processos.

## Média Prioridade

* [ ] Relatórios.
* [ ] Cadastro completo de Portos.
* [ ] Revisão do preenchimento automático de Importador e Exportador.

## Baixa Prioridade

* [ ] Sistema de Backup.
* [ ] Restauração de Backup.
* [ ] Revisão de Estância.
* [ ] Revisão do Método de Avaliação.

Esta versão funciona muito bem no **GitHub**, **VS Code**, **Obsidian**, **Notion** e outros editores Markdown, permitindo marcar cada item como concluído (`[x]`). Ela também organiza as tarefas por prioridade e módulos, facilitando o acompanhamento do desenvolvimento.
