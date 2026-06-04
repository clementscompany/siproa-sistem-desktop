import { useState, useEffect } from "react";
import SearchBoxForm from "./SearchInputBox";
import SearchBoxPaises from "./SearchBoxPaises";
import { CrfApi } from "../../api/Crf.api";
import { ImportadoresApi } from "../../api/Importadores.api";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import Alert from "../Alert/Alert";
import SheetCrf from "./SheetCrf";

const crfApi = new CrfApi();
const importadoresApi = new ImportadoresApi();

export default function FormDataCRF({ onClose, onSaved, crfId }) {
  const [openClientes, setOpenClientes] = useState(false);
  const [openPaises, setOpenPaises] = useState(false);
  const [clientSelected, setClientSelected] = useState("Selecione");
  const [paisSelected, setPaisSelected] = useState("Selecione");
  const [clientsList, setClientsList] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    status: "",
    title: "",
  });

  const inputBoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "flex-start",
  };

  const [data, setData] = useState({
    numero_crf: "",
    req_f: "",
    cliente_id: "",
    cliente: "",
    cliente_nif: "",
    cliente_endereco: "",
    data_entrada: new Date().toISOString().split("T")[0],
    du_numero: "",
    bl_numero: "",
    c_marca: "",
    crf_ou_f: "",
    factura: "",
    fob: 0,
    frete: 0,
    seguro: 0,
    cif: 0,
    via: "",
    via_id: "",
    pais_id: "",
    pais_nome: "",
    moeda: "",
    cambio: 1,
    valor_aduaneiro: 0,
    designacao: "",
    cambio_usd: 1,
    imposto_s_impo: 0,
    iva: 0,
    imposto_selo: 0,
    sobre_taxa: 0,
    emolumentos_gerais: 0,
    multas_crf: 0,
    subtotal: 0,
    ep17: 0,
    ep_15: 0,
    ep_14: 0,
    servico_transitario: 0,
    veterinario_saude: 0,
    validacao_bl: 0,
    assistencia: 0,
    deslocacao: 0,
    honorario: 0,
    inerentes: 0,
    licenciamento: 0,
    declaracao_valor: 0,
    modelo0: 0,
    t_emolument: 0,
    total_geral: 0,
    total_por_extenso: "",
    observacoes: "",
    estado_pagamento: "PENDENTE",
    referencia_bancaria: "",
  });

  // Load importadores on mount
  useEffect(() => {
    importadoresApi.getAll().then(setClientsList).catch(console.error);
  }, []);

  useEffect(() => {
    if (!crfId) return;

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const crf = await crfApi.getById(crfId);
        if (cancelled) return;

        if (!crf) {
          setAlertState({
            open: true,
            status: "error",
            title: "Erro",
            message: "CRF não encontrada",
            onClose: () => setAlertState((p) => ({ ...p, open: false })),
          });
          return;
        }

        setClientSelected(crf.cliente_nome || crf.cliente || "Selecione");
        setPaisSelected(crf.origem_nome || crf.pais_nome || "Selecione");

        setData((prev) => ({
          ...prev,
          ...crf,
          cliente: crf.cliente_nome || crf.cliente || "",
          cliente_nif: crf.cliente_nif || "",
          cliente_endereco: crf.cliente_endereco || "",
          pais_nome: crf.origem_nome || crf.pais_nome || "",
        }));
      } catch (error) {
        if (cancelled) return;
        setAlertState({
          open: true,
          status: "error",
          title: "Erro",
          message: "Falha ao carregar CRF",
          onClose: () => setAlertState((p) => ({ ...p, open: false })),
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [crfId]);

  // Calculations
  useEffect(() => {
    const parse = (val) => parseFloat(val) || 0;

    const fob = parse(data.fob);
    const frete = parse(data.frete);
    const seguro = parse(data.seguro);
    const cif = fob + frete + seguro;

    const imposto = parse(data.imposto_s_impo);
    const iva = parse(data.iva);
    const impostoSelo = parse(data.imposto_selo);
    const sobreTaxa = parse(data.sobre_taxa);
    const emolumentos = parse(data.emolumentos_gerais);
    const multas = parse(data.multas_crf);
    const subtotal =
      imposto + iva + impostoSelo + sobreTaxa + emolumentos + multas;

    const ep17 = parse(data.ep17);
    const ep15 = parse(data.ep_15);
    const ep14 = parse(data.ep_14);
    const servTrans = parse(data.servico_transitario);
    const vet = parse(data.veterinario_saude);
    const validacao = parse(data.validacao_bl);
    const assist = parse(data.assistencia);
    const desloc = parse(data.deslocacao);
    const honorario = parse(data.honorario);
    const inerentes = parse(data.inerentes);

    const lic = parse(data.licenciamento);
    const dec = parse(data.declaracao_valor);
    const mod0 = parse(data.modelo0);
    const totalEmolument = lic + dec + mod0;

    const totalGeral =
      subtotal +
      ep17 +
      ep15 +
      ep14 +
      servTrans +
      vet +
      validacao +
      assist +
      desloc +
      honorario +
      inerentes +
      totalEmolument;

    setData((prev) => ({
      ...prev,
      cif: cif.toFixed(2),
      subtotal: subtotal.toFixed(2),
      t_emolument: totalEmolument.toFixed(2),
      total_geral: totalGeral.toFixed(2),
    }));
  }, [
    data.fob,
    data.frete,
    data.seguro,
    data.imposto_s_impo,
    data.iva,
    data.imposto_selo,
    data.sobre_taxa,
    data.emolumentos_gerais,
    data.multas_crf,
    data.ep17,
    data.ep_15,
    data.ep_14,
    data.servico_transitario,
    data.veterinario_saude,
    data.validacao_bl,
    data.assistencia,
    data.deslocacao,
    data.honorario,
    data.inerentes,
    data.licenciamento,
    data.declaracao_valor,
    data.modelo0,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCliente = () => {
    setOpenClientes(true);
  };

  const closeClientSearchBox = () => {
    setOpenClientes(false);
  };

  const checkedValue = (cliente) => {
    closeClientSearchBox();
    setClientSelected(cliente.nome);
    setData((prev) => ({
      ...prev,
      cliente_id: cliente.id,
      cliente: cliente.nome,
      cliente_nif: cliente?.nif || "",
      cliente_endereco: cliente?.morada || cliente?.cliente_endereco || "",
    }));
  };

  const handleOpenPais = () => {
    setOpenPaises(true);
  };

  const closePaisSearchBox = () => {
    setOpenPaises(false);
  };

  const checkedPais = (pais) => {
    closePaisSearchBox();
    setPaisSelected(pais.nome);
    setData((prev) => ({
      ...prev,
      pais_id: pais.codigo,
      pais_nome: pais.nome,
    }));
  };

  const handleSave = async (printAfter = false) => {
    try {
      setSaving(true);
      const result = crfId
        ? await crfApi.update(crfId, data)
        : await crfApi.create(data);
      const payload = result?.data ?? result;
      if (payload?.numero_crf)
        setData((prev) => ({ ...prev, numero_crf: payload.numero_crf }));
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: crfId
          ? "CRF atualizada com sucesso!"
          : "CRF salva com sucesso!",
        onClose: () => {
          setAlertState((p) => ({ ...p, open: false }));
          if (onSaved) {
            onSaved(payload);
          }
          onClose();
        },
      });
      if (printAfter) {
        // Trigger print logic here
        setTimeout(() => window.print(), 500);
      }
    } catch (error) {
      console.error("Erro completo:", error);
      const errorMessage =
        error.message || error.toString() || "Erro ao salvar CRF";
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: errorMessage,
        onClose: () => {
          setAlertState((p) => ({ ...p, open: false }));
        },
      });
    } finally {
      setSaving(false);
      setShowPrintModal(false);
    }
  };

  const handlePrintClick = (e) => {
    e.preventDefault();
    setShowPrintModal(true);
  };

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button
          onClick={onClose}
          style={{
            color: "red",
            background: "none",
            border: "2px solid var(--error-bg)",
            padding: "5px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>

        <button
          onClick={handlePrintClick}
          className="btn btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            padding: "5px 15px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <i className="bi bi-printer"></i>
          Imprimir
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave(false);
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 15,
          marginTop: 20,
        }}
      >
        {/* IDENTIFICAÇÃO */}
        <div style={inputBoxStyle}>
          <label>Nº CRF (Auto)</label>
          <input
            value={data.numero_crf}
            placeholder="Gerado ao salvar"
            readOnly
          />
        </div>

        <div style={inputBoxStyle}>
          <label>ReqF</label>
          <input name="req_f" value={data.req_f} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Cliente</label>
          <input
            name="cliente"
            value={clientSelected}
            onClick={handleOpenCliente}
            readOnly
            style={{ cursor: "pointer" }}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Morada do Cliente</label>
          <input
            name="cliente_endereco"
            value={data.cliente_endereco}
            readOnly
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Data Entrada</label>
          <input
            type="date"
            name="data_entrada"
            value={data.data_entrada}
            onChange={handleChange}
          />
        </div>

        {/* DOCUMENTOS */}
        <div style={inputBoxStyle}>
          <label>DU Nº</label>
          <input
            name="du_numero"
            value={data.du_numero}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>BL Nº</label>
          <input
            name="bl_numero"
            value={data.bl_numero}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>C/Marca</label>
          <input name="c_marca" value={data.c_marca} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>CRF ou</label>
          <input
            name="crf_ou_f"
            value={data.crf_ou_f}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Factura Nº</label>
          <input name="factura" value={data.factura} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Via</label>
          <select
            name="via"
            value={data.via}
            onChange={handleChange}
            style={{
              padding: "8px",
              border: "1px solid var(--input-border)",
              borderRadius: "var(--radius)",
              background: "var(--input)",
              color: "var(--text)",
            }}
          >
            <option value="">Selecione</option>
            <option value="RODOVIÁRIO">RODOVIÁRIO</option>
            <option value="FERROVIÁRIO">FERROVIÁRIO</option>
            <option value="MARÍTIMA">MARÍTIMA</option>
            <option value="AÉREA">AÉREA</option>
          </select>
        </div>

        <div
          style={{
            ...inputBoxStyle,
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <label>País</label>
          <div style={{ display: "flex", alignItems: "stretch", gap: "5px" }}>
            <input
              name="pais"
              value={paisSelected}
              onClick={handleOpenPais}
              readOnly
              style={{
                cursor: "pointer",
                flex: 1,
                padding: "6px 10px",
                border: "1px solid var(--input-border)",
                borderRadius: "var(--radius)",
                fontSize: "13px",
                background: "var(--input)",
              }}
            />
            <button
              type="button"
              onClick={handleOpenPais}
              style={{
                padding: "6px 12px",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "40px",
              }}
              title="Pesquisar País"
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        <div style={inputBoxStyle}>
          <label>Designação</label>
          <input
            name="designacao"
            value={data.designacao}
            onChange={handleChange}
          />
        </div>

        {/* VALORES BASE */}
        <div style={inputBoxStyle}>
          <label>FOB</label>
          <input
            type="number"
            name="fob"
            value={data.fob}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Frete</label>
          <input
            type="number"
            name="frete"
            value={data.frete}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Seguro</label>
          <input
            type="number"
            name="seguro"
            value={data.seguro}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>CIF (Auto)</label>
          <input
            value={data.cif}
            readOnly
            style={{ backgroundColor: "#f0f0f0" }}
          />
        </div>

        {/* TAXAS */}
        <div style={inputBoxStyle}>
          <label>Imposto</label>
          <input
            type="number"
            name="imposto_s_impo"
            value={data.imposto_s_impo}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>IVA</label>
          <input
            type="number"
            name="iva"
            value={data.iva}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Imposto Selo</label>
          <input
            type="number"
            name="imposto_selo"
            value={data.imposto_selo}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Sobre Taxa</label>
          <input
            type="number"
            name="sobre_taxa"
            value={data.sobre_taxa}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Emolumentos Gerais</label>
          <input
            type="number"
            name="emolumentos_gerais"
            value={data.emolumentos_gerais}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Multas CRF / Atraso</label>
          <input
            type="number"
            name="multas_crf"
            value={data.multas_crf}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Sub Total (Auto)</label>
          <input
            value={data.subtotal}
            readOnly
            style={{ backgroundColor: "#f0f0f0" }}
          />
        </div>

        {/* SERVIÇOS */}
        <div style={inputBoxStyle}>
          <label>EP 17</label>
          <input
            type="number"
            name="ep17"
            value={data.ep17}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>EP 15</label>
          <input
            type="number"
            name="ep_15"
            value={data.ep_15}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>EP 14</label>
          <input
            type="number"
            name="ep_14"
            value={data.ep_14}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Serviço Transitário</label>
          <input
            type="number"
            name="servico_transitario"
            value={data.servico_transitario}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Veterinário / Saúde</label>
          <input
            type="number"
            name="veterinario_saude"
            value={data.veterinario_saude}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Validação BL</label>
          <input
            type="number"
            name="validacao_bl"
            value={data.validacao_bl}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Assistência</label>
          <input
            type="number"
            name="assistencia"
            value={data.assistencia}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Deslocação</label>
          <input
            type="number"
            name="deslocacao"
            value={data.deslocacao}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Honorário</label>
          <input
            type="number"
            name="honorario"
            value={data.honorario}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Inerentes</label>
          <input
            type="number"
            name="inerentes"
            value={data.inerentes}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Licenciamento</label>
          <input
            type="number"
            name="licenciamento"
            value={data.licenciamento}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Declaração de Valor</label>
          <input
            type="number"
            name="declaracao_valor"
            value={data.declaracao_valor}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Modelo O</label>
          <input
            type="number"
            name="modelo0"
            value={data.modelo0}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Total Emolumentos (Auto)</label>
          <input
            value={data.t_emolument}
            readOnly
            style={{ backgroundColor: "#f0f0f0" }}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Total Geral (Auto)</label>
          <input
            value={data.total_geral}
            readOnly
            style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Valor Aduaneiro</label>
          <input
            type="number"
            name="valor_aduaneiro"
            value={data.valor_aduaneiro}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Moeda</label>
          <input
            name="moeda"
            value={data.moeda}
            onChange={handleChange}
            placeholder="Ex: USD, EUR"
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Câmbio</label>
          <input
            type="number"
            step="0.0001"
            name="cambio"
            value={data.cambio}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Câmbio USD</label>
          <input
            type="number"
            step="0.0001"
            name="cambio_usd"
            value={data.cambio_usd}
            onChange={handleChange}
          />
        </div>

        <div style={inputBoxStyle}>
          <label>Estado Pagamento</label>
          <select
            name="estado_pagamento"
            value={data.estado_pagamento}
            onChange={handleChange}
          >
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        <div style={inputBoxStyle}>
          <label>Referência Bancária</label>
          <input
            name="referencia_bancaria"
            value={data.referencia_bancaria}
            onChange={handleChange}
          />
        </div>

        {/* TEXTO */}
        <div style={{ gridColumn: "1 / span 4", ...inputBoxStyle }}>
          <label>Total por Extenso</label>
          <textarea
            rows={2}
            name="total_por_extenso"
            value={data.total_por_extenso}
            onChange={handleChange}
          />
        </div>

        <div style={{ gridColumn: "1 / span 4", ...inputBoxStyle }}>
          <label>Observações</label>
          <textarea
            rows={3}
            name="observacoes"
            value={data.observacoes}
            onChange={handleChange}
            placeholder="Observações adicionais..."
          />
        </div>

        <div style={{ gridColumn: "1 / span 1" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              background: "var(--primary)",
              color: "#fff",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>

      {/* SEARCH CLIENT MODAL */}
      <SearchBoxForm
        isOpen={openClientes}
        onClose={closeClientSearchBox}
        checkedValue={checkedValue}
        data={clientsList} // Pass real clients
        onClientSaved={(newClient) => {
          // Refresh importadores list after new importador is created
          importadoresApi.getAll().then(setClientsList).catch(console.error);
        }}
      />

      {/* SEARCH PAISES MODAL */}
      <SearchBoxPaises
        isOpen={openPaises}
        onClose={closePaisSearchBox}
        checkedValue={checkedPais}
      />

      {/* PRINT CONFIRMATION MODAL */}
      <Dialog open={showPrintModal} onClose={() => setShowPrintModal(false)}>
        <DialogTitle>Imprimir</DialogTitle>
        <DialogContent>
          <p>Deseja salvar as alterações antes de imprimir?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrintModal(false)} color="error">
            Cancelar
          </Button>
          <Button
            onClick={() => handleSave(true)}
            color="primary"
            variant="contained"
          >
            Salvar e Imprimir
          </Button>
        </DialogActions>
      </Dialog>

      {/* PRINT SHEET COMPONENT */}
      {/* <SheetCrf data={data} /> */}

      {alertState.open === true && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={
            alertState.onClose ||
            (() => setAlertState((p) => ({ ...p, open: false })))
          }
        />
      )}
    </div>
  );
}
