import { useState } from "react";
import SearchBoxForm from "./SearchInputBox";

export default function FormDataCRF({ onClose }) {
  const [openClientes, setOpenClientes] = useState(false);
  const inputBoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };

  const [data, setData] = useState({
    id: Math.floor(Math.random() * 10000),
    req_f: "",
    cliente: "",
    data_entrada: "",
    data_pagamento: "",
    du_numero: "",
    bl_numero: "",
    c_marca: "",
    crf_ou_f: "",
    factura: "",
    fob: "",
    frete: "",
    seguro: "",
    cif: "",
    via: "",
    consignatario: "",
    pais_id: "",
    moeda_id: "",
    cambio: "",
    valor_aduaneiro: "",
    designacao: "",
    cambio_usd: "",
    imposto_s_impo: "",
    iva: "",
    emolumentos_gerais: "",
    multas_crf: "",
    subtotal: "",
    ep17: "",
    veterinario_saude: "",
    validacao_bl: "",
    assistencia: "",
    deslocacao: "",
    sub_total_2: "",
    du_valor: "",
    licenciamento: "",
    declaracao_valor: "",
    modelo0: "",
    fotocopias: "",
    t_emolument: "",
    sub_total_3: "",
    total_geral: "",
    total_por_extenso: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCliente = (e) => {
    const { name, value } = e.target
    setOpenClientes(true);

  }

  return (
    <div style={{ background: "#fff", padding: 20, borderRadius: 10 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button className="btn btn-warning" style={{ border: "2px solid var(--primary)", color: "var(--primary)", backgroundColor: "transparent" }}>Visualizar</button>
        <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <i className="bi bi-printer"></i>
          Imprimir
        </button>
        <button onClick={onClose} style={{ color: "red", background: "none" }}>
          Cancelar
        </button>
      </div>

      {/* FORM */}
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 15,
          marginTop: 20,
        }}
      >
        {/* IDENTIFICAÇÃO */}
        <div style={inputBoxStyle}>
          <label>Nº</label>
          <input value={data.id} readOnly />
        </div>

        <div style={inputBoxStyle}>
          <label>ReqF</label>
          <input name="req_f" value={data.req_f} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Cliente</label>
          <input name="cliente" value={data.cliente} onFocus={handleOpenCliente} />
        </div>

        <div style={inputBoxStyle}>
          <label>Data Entrada</label>
          <input type="date" name="data_entrada" value={data.data_entrada} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Data Pagamento</label>
          <input type="date" name="data_pagamento" value={data.data_pagamento} onChange={handleChange} />
        </div>

        {/* DOCUMENTOS */}
        <div style={inputBoxStyle}>
          <label>DU Nº</label>
          <input name="du_numero" value={data.du_numero} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>BL Nº</label>
          <input name="bl_numero" value={data.bl_numero} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>C/Marca</label>
          <input name="c_marca" value={data.c_marca} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>CRF ou</label>
          <input name="crf_ou_f" value={data.crf_ou_f} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Factura Nº</label>
          <input name="factura" value={data.factura} onChange={handleChange} />
        </div>

        {/* VALORES BASE */}
        <div style={inputBoxStyle}>
          <label>FOB</label>
          <input name="fob" value={data.fob} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Frete</label>
          <input name="frete" value={data.frete} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Seguro</label>
          <input name="seguro" value={data.seguro} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>CIF</label>
          <input value={data.cif} readOnly />
        </div>

        {/* TAXAS */}
        <div style={inputBoxStyle}>
          <label>Imposto</label>
          <input name="imposto_s_impo" value={data.imposto_s_impo} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>IVA</label>
          <input name="iva" value={data.iva} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Emolumentos Gerais</label>
          <input name="emolumentos_gerais" value={data.emolumentos_gerais} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Multas CRF / Atraso</label>
          <input name="multas_crf" value={data.multas_crf} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Sub Total</label>
          <input value={data.subtotal} readOnly />
        </div>

        {/* SERVIÇOS */}
        <div style={inputBoxStyle}>
          <label>EP 17</label>
          <input name="ep17" value={data.ep17} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Veterinário / Saúde</label>
          <input name="veterinario_saude" value={data.veterinario_saude} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Validação BL</label>
          <input name="validacao_bl" value={data.validacao_bl} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Assistência</label>
          <input name="assistencia" value={data.assistencia} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Deslocação</label>
          <input name="deslocacao" value={data.deslocacao} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>DU</label>
          <input name="du_valor" value={data.du_valor} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Licenciamento</label>
          <input name="licenciamento" value={data.licenciamento} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Declaração de Valor</label>
          <input name="declaracao_valor" value={data.declaracao_valor} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Modelo O</label>
          <input name="modelo0" value={data.modelo0} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Fotocópias</label>
          <input name="fotocopias" value={data.fotocopias} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Total Emolumentos</label>
          <input name="t_emolument" value={data.t_emolument} onChange={handleChange} />
        </div>

        <div style={inputBoxStyle}>
          <label>Total Geral</label>
          <input value={data.total_geral} readOnly />
        </div>

        {/* TEXTO */}
        <div style={{ gridColumn: "1 / span 4", ...inputBoxStyle }}>
          <label>Total por Extenso</label>
          <textarea
            rows={3}
            name="total_por_extenso"
            value={data.total_por_extenso}
            onChange={handleChange}
          />
        </div>

        <div style={{ gridColumn: "1 / span 1" }}>
          <button style={{ width: "100%", background: "var(--primary)", color: "#fff" }}>
            Salvar
          </button>
        </div>
      </form>

      <SearchBoxForm isOpen={openClientes} />
    </div>
  );
}
