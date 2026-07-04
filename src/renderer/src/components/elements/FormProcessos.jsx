import { useEffect, useState } from "react";
import { ProcessosApi } from "../../api/Processos.api";
import { ImportadoresApi } from "../../api/Importadores.api";
import Alert from "../Alert/Alert";
import SearchBoxForm from "./SearchInputBox";
import ListBank from "./ListBank";
import ListPortos from "./ListPortos";
import ListFormaPagamento from "./ListFormaPagamento";
import SearchBoxPaises from "./SearchBoxPaises";
import ListMeioTransporte from "./ListMeioTransporte";
import ListRegime from "./ListRegime";
import ListEstancias from "./ListEstancias";
import ListCodExportador from "./ListCodExportador";
import ListIneExportador from "./ListIneExportador";
import ListMoradaExportador from "./ListMoradaExportador";

const processosApi = new ProcessosApi();
const importadoresApi = new ImportadoresApi();

// Opções estáticas para os campos
const regimeOptions = [
  { value: '11', label: '11 — Importação Definitiva' },
  { value: '12', label: '12 — Importação Simplificada' },
  { value: '13', label: '13 — Importação Incompleta' },
  { value: '14', label: '14 — Importação Temporária' },
  { value: '141', label: '141 — Importação Temporária' },
  { value: '142', label: '142 — Importação Temporária' },
  { value: '143', label: '143 — Importação Temporária' },
  { value: '15', label: '15 — Re-Importação' },
  { value: '151', label: '151 — Re-Importação' },
  { value: '152', label: '152 — Re-Importação' },
  { value: '21', label: '21 — Exportação Definitiva' },
  { value: '23', label: '23 — Exportação Incompleta' },
  { value: '24', label: '24 — Exportação Temporária' },
  { value: '25', label: '25 — Re-Exportação' },
  { value: '41', label: '41 — Armazém Afiançado' },
  { value: '51', label: '51 — Trânsito Doméstico' },
  { value: '61', label: '61 — Trânsito Internacional' }
];

const volumeOptions = [
  { value: 'B', label: 'B — Carga a Granel' },
  { value: 'F', label: 'F — Contentor Carregado Cheio' },
  { value: 'G', label: 'G — Carga Geral' },
  { value: 'L', label: 'L — Contentor Carregado Não Cheio' },
  { value: 'N', label: 'N — Números (por unidade)' }
];

const transporteOptions = [
  { value: '11', label: '11 — Marítimo' },
  { value: '12', label: '12 — Ferroviário' },
  { value: '13', label: '13 — Rodoviário' },
  { value: '14', label: '14 — Aéreo' },
  { value: '141', label: '141 — Postal' },
  { value: '142', label: '142 — Multimodal' },
  { value: '143', label: '143 — Condutas de Transportação Fixa' },
  { value: '15', label: '15 — Transporte Fluvial' },
  { value: '151', label: '151 — Modo de Transporte Não Aplicável' }
];

const pagamentoOptions = [
  { value: 'CA', label: 'CA — Pagamento por Adiantamento' },
  { value: 'CD', label: 'CD — Pagamento Contra Reembolso' },
  { value: 'LC', label: 'LC — Carta de Crédito' },
  { value: 'NR', label: 'NR — Não Reembolsável' },
  { value: 'OA', label: 'OA — Carta Aberta' },
  { value: 'PP', label: 'PP — Pré-Pagamento' },
  { value: 'SD', label: 'SD — Pagamento à Vista' },
  { value: 'TT', label: 'TT — Transferência Telegráfica' }
];

const bancoOptions = [
  { value: '0001', label: '0001 — BPC — Banco de Poupança e Crédito' },
  { value: '0004', label: '0004 — BCGA — Banco Caixa Geral Angola' },
  { value: '0005', label: '0005 — BCI — Banco de Comércio e Indústria' },
  { value: '0006', label: '0006 — BFA — Banco de Fomento Angola' },
  { value: '0040', label: '0040 — BAI — Banco Angolano de Investimentos' },
  { value: '0043', label: '0043 — BNI — Banco de Negócios Internacional' },
  { value: '0044', label: '0044 — BCA — Banco Comercial Angolano' },
  { value: '0045', label: '0045 — SOL — Banco Sol' },
  { value: '0047', label: '0047 — KEVE — Banco Keve' },
  { value: '0051', label: '0051 — BIC — Banco BIC' },
  { value: '0052', label: '0052 — BMA — Banco Millennium Atlântico' },
  { value: '0054', label: '0054 — SBA — Standard Bank Angola' },
  { value: '0055', label: '0055 — Banco VTB África' },
  { value: '0058', label: '0058 — Banco Económico' },
  { value: '0061', label: '0061 — Standard Chartered Bank Angola' },
  { value: '0063', label: '0063 — Banco Finibanco Angola' },
  { value: '0066', label: '0066 — BIR — Banco de Investimento Rural' },
  { value: '0069', label: '0069 — BCS — Banco de Crédito do Sul' },
  { value: '0070', label: '0070 — BMF — Banco Micro Finanças' }
];

export default function FormProcessos({ onClose, onSaved, processoId }) {
  const [clients, setClients] = useState([]);
  const [openClientSearch, setOpenClientSearch] = useState(false);
  const [openBankSearch, setOpenBankSearch] = useState(false);
  const [openPortoSearch, setOpenPortoSearch] = useState(false);
  const [openPaymentSearch, setOpenPaymentSearch] = useState(false);
  const [openEmbarqueSearch, setOpenEmbarqueSearch] = useState(false);
  const [openProcedenciaSearch, setOpenProcedenciaSearch] = useState(false);
  const [openDestinoSearch, setOpenDestinoSearch] = useState(false);
  const [openExportSearch, setOpenExportSearch] = useState(false);
  const [openTransportSearch, setOpenTransportSearch] = useState(false);
  const [openNacionalidadeSearch, setOpenNacionalidadeSearch] = useState(false);
  const [openRegimeSearch, setOpenRegimeSearch] = useState(false);
  const [openEstanciaSearch, setOpenEstanciaSearch] = useState(false);
  const [openCodExportSearch, setOpenCodExportSearch] = useState(false);
  const [openIneExportSearch, setOpenIneExportSearch] = useState(false);
  const [openMoradaExportSearch, setOpenMoradaExportSearch] = useState(false);
  const [openMoradaImportSearch, setOpenMoradaImportSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    status: "",
    title: "",
  });

  const [data, setData] = useState({
    importador_id: "",
    cliente_nome: "",
    conta_numero: "",
    contablista: "",
    quantidade_adicoes: "",
    cambio_usd: "",
    cod_regime: "",
    moeda: "AOA",
    cambio_moeda: "",
    estancia: "",
    fob: 0,
    peso_bruto: 0,
    fiscalizacao_porto: 0,
    frete: 0,
    peso_liquido: 0,
    aeroporto: 0,
    soma: 0,
    numero_volume: 0,
    cif: 0,
    cod_volume: "",
    seguro: 0,
    // Importador
    importador_nif: "",
    importador_morada: "",
    importador_ine: "",
    // Exportador
    exportador_nome: "",
    exportador_cod: "",
    exportador_ine: "",
    exportador_morada: "",
    // Transporte
    meio_transporte: "",
    nacionalidade: "",
    registo_transporte: "",
    manifest_numero: "",
    doc_transporte: "",
    // Chegada
    data_chegada: "",
    porto_entrada_saida: "",
    posto_fronteirico: "",
    garantia_nr: "",
    montante_garantia: 0,
    metodo_avaliacao: "",
    forma_pagamento: "",
    detalhes_banco: "",
    // Marcas e Números
    descricao: "",
    local_embarque: "",
    pais_procedencia: "",
    pais_destino: "",
    data_du: "",
    status: "aberta",
    observacoes: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const list = await importadoresApi.getAll();
        setClients(list);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadProcesso = async () => {
      if (!processoId) return;
      try {
        const processo = await processosApi.getById(processoId);
        setData({
          ...processo,
          importador_id: processo.importador_id ?? "",
          cliente_nome: processo.cliente_nome ?? "",
          conta_numero: processo.conta_numero ?? "",
          contablista: processo.contablista ?? "",
          quantidade_adicoes: processo.quantidade_adicoes ?? "",
          cambio_usd: processo.cambio_usd ?? "",
          cod_regime: processo.cod_regime ?? "",
          moeda: processo.moeda ?? "AOA",
          cambio_moeda: processo.cambio_moeda ?? "",
          estancia: processo.estancia ?? "",
          fob: processo.fob ?? 0,
          peso_bruto: processo.peso_bruto ?? 0,
          fiscalizacao_porto: processo.fiscalizacao_porto ?? 0,
          frete: processo.frete ?? 0,
          peso_liquido: processo.peso_liquido ?? 0,
          aeroporto: processo.aeroporto ?? 0,
          soma: processo.soma ?? 0,
          numero_volume: processo.numero_volume ?? 0,
          cif: processo.cif ?? 0,
          cod_volume: processo.cod_volume ?? "",
          seguro: processo.seguro ?? 0,
          importador_nif: processo.importador_nif ?? "",
          importador_morada: processo.importador_morada ?? "",
          importador_ine: processo.importador_ine ?? "",
          exportador_nome: processo.exportador_nome ?? "",
          exportador_cod: processo.exportador_cod ?? "",
          exportador_ine: processo.exportador_ine ?? "",
          exportador_morada: processo.exportador_morada ?? "",
          meio_transporte: processo.meio_transporte ?? "",
          nacionalidade: processo.nacionalidade ?? "",
          registo_transporte: processo.registo_transporte ?? "",
          manifest_numero: processo.manifest_numero ?? "",
          doc_transporte: processo.doc_transporte ?? "",
          data_chegada: processo.data_chegada ?? "",
          porto_entrada_saida: processo.porto_entrada_saida ?? "",
          posto_fronteirico: processo.posto_fronteirico ?? "",
          garantia_nr: processo.garantia_nr ?? "",
          montante_garantia: processo.montante_garantia ?? 0,
          metodo_avaliacao: processo.metodo_avaliacao ?? "",
          forma_pagamento: processo.forma_pagamento ?? "",
          detalhes_banco: processo.detalhes_banco ?? "",
          descricao: processo.descricao ?? "",
          local_embarque: processo.local_embarque ?? "",
          pais_procedencia: processo.pais_procedencia ?? "",
          pais_destino: processo.pais_destino ?? "",
          data_du: processo.data_du ?? "",
          status: processo.status ?? "aberta",
          observacoes: processo.observacoes ?? "",
        });
      } catch (e) {
        console.error(e);
      }
    };
    loadProcesso();
  }, [processoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const handleSelectClient = (client) => {
    setData((p) => ({
      ...p,
      importador_id: client.id,
      cliente_nome: client.nome,
      importador_nif: client.nif || '',
      importador_morada: client.morada || '',
      importador_ine: client.codigo || ''
    }));
    setOpenClientSearch(false);
  };

  const handleSelectBank = (bank) => {
    setData((p) => ({
      ...p,
      detalhes_banco: `${bank.nome} - C: ${bank.conta_numero} - IBAN: ${bank.iban}`,
    }));
    setOpenBankSearch(false);
  };

  const handleSelectPorto = (port) => {
    setData((p) => ({
      ...p,
      porto_entrada_saida: `${port.CITY} - ${port.COUNTRY}`,
    }));
    setOpenPortoSearch(false);
  };

  const handleSelectPayment = (method) => {
    setData((p) => ({
      ...p,
      forma_pagamento: method.nome,
    }));
    setOpenPaymentSearch(false);
  };

  const handleSelectEmbarque = (port) => {
    setData((p) => ({
      ...p,
      local_embarque: `${port.CITY} - ${port.COUNTRY}`,
    }));
    setOpenEmbarqueSearch(false);
  };

  const handleSelectProcedencia = (pais) => {
    setData((p) => ({
      ...p,
      pais_procedencia: pais.nome,
    }));
    setOpenProcedenciaSearch(false);
  };

  const handleSelectDestino = (pais) => {
    setData((p) => ({
      ...p,
      pais_destino: pais.nome,
    }));
    setOpenDestinoSearch(false);
  };

  const handleSelectExport = (client) => {
    setData((p) => ({
      ...p,
      exportador_nome: client.nome,
      exportador_cod: client.codigo || '',
      exportador_ine: client.codigo || '',
      exportador_morada: client.morada || '',
    }));
    setOpenExportSearch(false);
  };

  const handleSelectTransport = (transport) => {
    setData((p) => ({
      ...p,
      meio_transporte: transport.nome,
    }));
    setOpenTransportSearch(false);
  };

  const handleSelectNacionalidade = (pais) => {
    setData((p) => ({
      ...p,
      nacionalidade: pais.nome,
    }));
    setOpenNacionalidadeSearch(false);
  };

  const handleSelectRegime = (regime) => {
    setData((p) => ({
      ...p,
      cod_regime: regime.codigo,
    }));
    setOpenRegimeSearch(false);
  };

  const handleSelectEstancia = (estancia) => {
    setData((p) => ({
      ...p,
      estancia: estancia.nome,
    }));
    setOpenEstanciaSearch(false);
  };

  const handleSelectCodExport = (item) => {
    setData((p) => ({
      ...p,
      exportador_nome: item.nome,
      exportador_cod: item.codigo,
    }));
    setOpenCodExportSearch(false);
  };

  const handleSelectIneExport = (item) => {
    setData((p) => ({
      ...p,
      exportador_ine: item.codigo,
    }));
    setOpenIneExportSearch(false);
  };

  const handleSelectMoradaExport = (item) => {
    setData((p) => ({
      ...p,
      exportador_morada: item.endereco,
    }));
    setOpenMoradaExportSearch(false);
  };


  const handleSelectMoradaImport = (item) => {
    setData((p) => ({
      ...p,
      importador_morada: item.endereco,
    }));
    setOpenMoradaImportSearch(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (processoId) {
        await processosApi.update(processoId, data);
      } else {
        await processosApi.create(data);
      }
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "Processo salvo com sucesso",
      });
      setTimeout(() => {
        onSaved?.();
        onClose?.();
      }, 1500);
    } catch (err) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: err.message || "Falha ao salvar Processo",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputBoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
    minWidth: "200px",
  };

  return (
    <div className="form-container" style={{ maxHeight: "80vh", overflowY: "auto", borderRadius: "8px" }}>
      <form
        onSubmit={handleSave}
        style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "20px" }}
      >
        {/* SEÇÃO 1: Identificação e Câmbio */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Conta nº</label>
              <input name="conta_numero" value={data.conta_numero} onChange={handleChange} placeholder="0 00" />
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Contabilista</label>
              <input name="contablista" value={data.contablista} onChange={handleChange} placeholder="Nome" />
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Qtd Adições</label>
              <input name="quantidade_adicoes" value={data.quantidade_adicoes} onChange={handleChange} type="number" />
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Câmbio USD</label>
              <select name="cambio_usd" value={data.cambio_usd} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="fixo">Fixo</option>
                <option value="variavel">Variável</option>
              </select>
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Cod. Regime</label>
              <select name="cod_regime" value={data.cod_regime} onChange={handleChange}>
                <option value="">Selecione</option>
                {regimeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Moeda</label>
              <select name="moeda" value={data.moeda} onChange={handleChange}>
                <option value="AOA">AOA</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Câmbio da Moeda</label>
              <select name="cambio_moeda" value={data.cambio_moeda} onChange={handleChange}>
                <option value="">Selecione</option>
              </select>
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Estância</label>
              <input
                name="estancia"
                value={data.estancia}
                onClick={() => setOpenEstanciaSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={inputBoxStyle}></div> {/* Placeholder para fechar o grid de 3 */}
          </div>
        </div>

        {/* SEÇÃO 2: Financeiro e Pesos */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Fob</label><input type="number" name="fob" value={data.fob} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Frete</label><input type="number" name="frete" value={data.frete} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Soma</label><input type="number" name="soma" value={data.soma} onChange={handleChange} /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>CIF</label><input type="number" name="cif" value={data.cif} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Seguro</label><input type="number" name="seguro" value={data.seguro} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Peso Bruto</label><input type="number" name="peso_bruto" value={data.peso_bruto} onChange={handleChange} /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Peso Líquido</label><input type="number" name="peso_liquido" value={data.peso_liquido} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Nº Volume</label><input type="number" name="numero_volume" value={data.numero_volume} onChange={handleChange} /></div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Cod. Volume</label>
              <select name="cod_volume" value={data.cod_volume} onChange={handleChange}>
                <option value="">Selecione</option>
                {volumeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Fiscalização Porto</label><input type="number" name="fiscalizacao_porto" value={data.fiscalizacao_porto} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Aeroporto</label><input type="number" name="aeroporto" value={data.aeroporto} onChange={handleChange} /></div>
            <div style={inputBoxStyle}></div>
          </div>
        </div>

        {/* SECTION: Importador */}
        <div style={{ borderTop: "2px solid var(--primary)", paddingTop: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}># IMPORTADOR</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Nome / Cliente</label>
              <input
                name="cliente_nome"
                value={data.cliente_nome}
                onClick={() => setOpenClientSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer", border: "1px solid var(--primary)" }}
              />
            </div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Nº Contribuinte</label><input name="importador_nif" value={data.importador_nif} onChange={handleChange} /></div>
            <div style={inputBoxStyle} ><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Morada</label><input name="importador_morada"
              placeholder="Clique para selecionar..."
              value={data.importador_morada} readOnly onClick={() => setOpenMoradaImportSearch(true)} /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>INE</label><input type="number" name="importador_ine" value={data.importador_ine} onChange={handleChange} /></div>
            <div style={inputBoxStyle}></div>
            <div style={inputBoxStyle}></div>
          </div>
        </div>

        {/* SECTION: Exportador */}
        <div style={{ borderTop: "2px solid var(--primary)", paddingTop: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}># EXPORTADOR</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Nome</label>
              <input
                name="exportador_nome"
                value={data.exportador_nome}
                onClick={() => setOpenExportSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer", border: "1px solid var(--primary)" }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Cod. Exportador</label>
              <input
                name="exportador_cod"
                value={data.exportador_cod}
                onClick={() => setOpenCodExportSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>INE</label>
              <input
                name="exportador_ine"
                value={data.exportador_ine}
                onClick={() => setOpenIneExportSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Morada</label>
              <input
                name="exportador_morada"
                value={data.exportador_morada}
                onClick={() => setOpenMoradaExportSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={inputBoxStyle}></div>
            <div style={inputBoxStyle}></div>
          </div>
        </div>

        {/* Transporte & Manifesto */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Meio transporte</label>
              <select name="meio_transporte" value={data.meio_transporte} onChange={handleChange}>
                <option value="">Selecione</option>
                {transporteOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Nacionalidade</label>
              <input
                name="nacionalidade"
                value={data.nacionalidade}
                onClick={() => setOpenNacionalidadeSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Reg. Transporte</label><input name="registo_transporte" value={data.registo_transporte} onChange={handleChange} /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Manifesto nº</label><input type="number" name="manifest_numero" value={data.manifest_numero} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Doc transporte</label><input name="doc_transporte" value={data.doc_transporte} onChange={handleChange} /></div>
            <div style={inputBoxStyle}></div>
          </div>
        </div>

        {/* SECTION: Chegada */}
        <div style={{ borderTop: "2px solid var(--primary)", paddingTop: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}># DATA DA CHEGADA</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Data</label><input type="date" name="data_chegada" value={data.data_chegada} onChange={handleChange} /></div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Porto Entrada/Saída</label>
              <input
                name="porto_entrada_saida"
                value={data.porto_entrada_saida}
                onClick={() => setOpenPortoSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Posto Fronteiriço</label><input name="posto_fronteirico" value={data.posto_fronteirico} onChange={handleChange} /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Garantia NR</label><input name="garantia_nr" value={data.garantia_nr} onChange={handleChange} /></div>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Montante Garantia</label><input type="number" name="montante_garantia" value={data.montante_garantia} onChange={handleChange} /></div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Método Avaliação</label>
              <select name="metodo_avaliacao" value={data.metodo_avaliacao} onChange={handleChange}><option value="">Selecione</option></select>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Forma Pagamento</label>
              <select name="forma_pagamento" value={data.forma_pagamento} onChange={handleChange}>
                <option value="">Selecione</option>
                {pagamentoOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Detalhes Banco</label>
              <select name="detalhes_banco" value={data.detalhes_banco} onChange={handleChange}>
                <option value="">Selecione</option>
                {bancoOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div style={inputBoxStyle}></div>
          </div>
        </div>

        {/* SECTION: Marcas e Números */}
        <div style={{ borderTop: "2px solid var(--primary)", paddingTop: "16px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", color: "var(--primary)" }}># MARCAS E NÚMEROS</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ ...inputBoxStyle, minWidth: "100%" }}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Descrição</label><input name="descricao" value={data.descricao} onChange={handleChange} /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "16px" }}>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Local Embarque</label>
              <input
                name="local_embarque"
                value={data.local_embarque}
                onClick={() => setOpenEmbarqueSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>País Procedência</label>
              <input
                name="pais_procedencia"
                value={data.pais_procedencia}
                onClick={() => setOpenProcedenciaSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>País Destino</label>
              <input
                name="pais_destino"
                value={data.pais_destino}
                onClick={() => setOpenDestinoSearch(true)}
                readOnly
                placeholder="Clique para selecionar..."
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={inputBoxStyle}><label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Data do DU</label><input type="date" name="data_du" value={data.data_du} onChange={handleChange} /></div>
            <div style={inputBoxStyle}>
              <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase" }}>Status</label>
              <input name="status" value={data.status} onChange={handleChange} readOnly style={{ background: "#f9f9f9" }} />
            </div>
            <div style={inputBoxStyle}></div>
          </div>
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-secondary)" }}>Observações</label>
          <textarea
            name="observacoes"
            value={data.observacoes}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid var(--border)", background: "var(--input)" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
          <button type="button" onClick={onClose} style={{ background: "transparent", border: "1px solid var(--border)", padding: "10px 24px", borderRadius: "4px", cursor: "pointer", fontWeight: 500 }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} style={{ background: "var(--primary)", color: "white", border: "none", padding: "10px 32px", borderRadius: "4px", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {saving ? "Salvando..." : "Salvar Processo"}
          </button>
        </div>
      </form>

      {openClientSearch && (
        <SearchBoxForm
          isOpen={openClientSearch}
          onClose={() => setOpenClientSearch(false)}
          data={clients}
          checkedValue={handleSelectClient}
          title="Selecionar Cliente"
        />
      )}

      {openExportSearch && (
        <SearchBoxForm
          isOpen={openExportSearch}
          onClose={() => setOpenExportSearch(false)}
          data={clients}
          checkedValue={handleSelectExport}
          title="Selecionar Exportador"
        />
      )}

      {openBankSearch && (
        <ListBank
          isOpen={openBankSearch}
          onClose={() => setOpenBankSearch(false)}
          onSelect={handleSelectBank}
        />
      )}

      {openPortoSearch && (
        <ListPortos
          isOpen={openPortoSearch}
          onClose={() => setOpenPortoSearch(false)}
          onSelect={handleSelectPorto}
        />
      )}

      {openPaymentSearch && (
        <ListFormaPagamento
          isOpen={openPaymentSearch}
          onClose={() => setOpenPaymentSearch(false)}
          onSelect={handleSelectPayment}
        />
      )}

      {openEmbarqueSearch && (
        <ListPortos
          isOpen={openEmbarqueSearch}
          onClose={() => setOpenEmbarqueSearch(false)}
          onSelect={handleSelectEmbarque}
        />
      )}

      {openProcedenciaSearch && (
        <SearchBoxPaises
          isOpen={openProcedenciaSearch}
          onClose={() => setOpenProcedenciaSearch(false)}
          checkedValue={handleSelectProcedencia}
        />
      )}

      {openDestinoSearch && (
        <SearchBoxPaises
          isOpen={openDestinoSearch}
          onClose={() => setOpenDestinoSearch(false)}
          checkedValue={handleSelectDestino}
        />
      )}

      {openTransportSearch && (
        <ListMeioTransporte
          isOpen={openTransportSearch}
          onClose={() => setOpenTransportSearch(false)}
          onSelect={handleSelectTransport}
        />
      )}

      {openNacionalidadeSearch && (
        <SearchBoxPaises
          isOpen={openNacionalidadeSearch}
          onClose={() => setOpenNacionalidadeSearch(false)}
          checkedValue={handleSelectNacionalidade}
        />
      )}

      {openRegimeSearch && (
        <ListRegime
          isOpen={openRegimeSearch}
          onClose={() => setOpenRegimeSearch(false)}
          onSelect={handleSelectRegime}
        />
      )}

      {openEstanciaSearch && (
        <ListEstancias
          isOpen={openEstanciaSearch}
          onClose={() => setOpenEstanciaSearch(false)}
          onSelect={handleSelectEstancia}
        />
      )}

      {openCodExportSearch && (
        <ListCodExportador
          isOpen={openCodExportSearch}
          onClose={() => setOpenCodExportSearch(false)}
          onSelect={handleSelectCodExport}
        />
      )}

      {openIneExportSearch && (
        <ListIneExportador
          isOpen={openIneExportSearch}
          onClose={() => setOpenIneExportSearch(false)}
          onSelect={handleSelectIneExport}
        />
      )}

      {openMoradaExportSearch && (
        <ListMoradaExportador
          isOpen={openMoradaExportSearch}
          onClose={() => setOpenMoradaExportSearch(false)}
          onSelect={handleSelectMoradaExport}
        />
      )}


      {openMoradaImportSearch && (
        <ListMoradaExportador
          isOpen={openMoradaImportSearch}
          onClose={() => setOpenMoradaImportSearch(false)}
          onSelect={handleSelectMoradaImport}
        />
      )}

      {alertState.open && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={() => setAlertState((p) => ({ ...p, open: false }))}
        />
      )}
    </div>
  );
}
