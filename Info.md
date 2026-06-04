#=========================================
#=================== Correcoes ===========
-- No CRF => Campo "CRF ou" AO introduzir dados nele, os dados não gravam pois não é possivel
visualizar na fatura gerado => O Mesmo Campo "CRF ou" Passa a ser Nº Do Processo;

-- Campo Ou Text-Box => "Total Por Extenso" já não funciona automaticamente, estão a inserir manualmente, deve ser revisado ai também

--Por fim, na faturada gerado viu-se a necessidade de diminuir um pouco o tamanho da fonte do conteudo do cabeçalho

#=========================================
#================== Implementações =======
-- Sistema de Backup
-- Relatorios em (Processos, CRF, Arquivos) semanal, mesal e anual

#========= Continuação de Processos ======
-- > Campo: COD. REGIME - deve ser do tipo Select do opcoes pré definida como :
|COD | DESIGNAÇÃO |
|11 | Importação Definitiva |
|12 | Importação Simplificada|
|13 | Importação Imcompleta |
|14 | Importação Temporária |
|141 | Importação Temporária |
|142 | Importação Temporária |
|143 | Importação Temporária |
|15 | Re-Importação |
|151 | Re-Importação |
|152 | Re-Importação |
|21 | Exportação Definitiva |
|23 | Exportação Imcompleta |
|24 | Exportação Temporária |
|25 | Re-Exportação |
|41 | Armazem Afiançado |
|51 | Trânsito Domestico |
|61 | Trânsito Internacional |

-- > Campo: COD. VOLUME - deve ser do tipo Select do opcoes pré definida como :
|COD. VOLUME | DESIGNAÇÃO |
|B | Carga a Granel |
|F | Contentor Carregado Cheio |
|G | Carga Geral |
|L | Contentor Carregado não Cheio ou no Meio |
|N | Números (por unidade) |

-- > Campo: MEIO DE TRANSPORTE - deve ser do tipo Select do opcoes pré definida como :
|COD. TRANSPORTE | DESIGNAÇÃO |
|11 | Maritimo |
|12 | Ferroviario |
|13 | Rodoviario |
|14 | Aéreo |
|141 | Postal |
|142 | Multi Modo |
|143 | Condutas de Transportação Fixa |
|15 | Transporte Fluvial |
|151 | Modo de Transporte não aplicável |

-- > Campo: FORMAS DE PAGAMENTO - deve ser do tipo Select do opcoes pré definida como :
|COD. PAGAMENTO | DESIGNAÇÃO |
|CA | Pagamento por Adiantamento |
|CD | Pagamento contra Reembolso |
|LC | Carta de Crédito |
|NR | Não Reembolsável |
|OA | Carta Aberta |
|PP | Pré Pagamento |
|SD | Pagamento a Vista |
|TT | Transferência Telwfráfica |

-- > Campo: DETALHE DO BANCO - deve ser do tipo Select do opcoes pré definida como :
|COD. REF | SIGLA | BANCO |
|0001 | BPC | Banco de Poupança e Crédito |
|0004 | BCGA | Banco Caixa Geral Angola |
|0005 | BCI | Banco de Comércio e Indústria |
|0006 | BFA | Banco de Fomento Angola |
|0040 | BAI | Banco Angolano de Investimentos |
|0043 | BNI | Banco de Negócios Internacional |
|0044 | BCA | Banco Comercial Angolano |
|0045 | SOL | Banco Sol |
|0047 | KEVE | Banco Keve |
|0051 | BIC | Banco BIC |
|0052 | BMA | Banco Millennium Atlântico |
|0054 | SBA | Standard Bank Angola |
|0055 | ### | Banco VTB África |
|0058 | ### | Banco Económico |
|0061 | ### | Standard Chartered Bank Angola |
|0063 | ### | Banco Finibanco Angola |
|0066 | BIR | Banco de Investimento Rural |
|0069 | BCS | Banco de Crédito do Sul |
|0070 | BMF | Banco Micro Finanças |

#============== ATENÇÃO EM ALGUNS PONTO JA FEITOS =======#

-- > Em IMPORTADOR -> Ao selecionar importador o restante dos campos que
tem haver com ele, devem ser preenchidos automaticamente como: Nº Contribuinte, Morada, INE (esse valor é atribuido manualmente ao cadastar pq nem todos têm o INE)

-- > Em EXPORTADOR também obedece a mesma condição do IMPORTADOR a cima referido

-- > Em PORTO ENTRADA/SAÌDA e Local de Embarque- falta portos, só tem alguns!

-- > Pontos que depois irei revisar: Estância e Metodo de Avaliação -> serão informações inseridas pelo contabilista

-- > Implementação de relatórios em CRF e Processo (totais semanais, mensais, anual) gerar um documento onde serão apresentado
todos esses valores

-- > Implementação de Backup e restauração do sistema
