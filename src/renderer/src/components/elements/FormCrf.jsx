export default function FormDataCRF() {
  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* ---------------- HEADER COM BOTÕES ------------------ */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <button className="btn btn-warning">
          <i className="bi bi-eye"></i> Visualizr a Folha
        </button>

        <button className="btn btn-primary">
          <i className="bi bi-download"></i> Salvar
        </button>

        <button style={{ backGroundColor: "red" }} >
          <i className="bi bi-plus-circle"></i> Nova
        </button>
      </div>

      {/* ---------------- FORMULÁRIO ------------------ */}
      <form
        className="crf-form"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          padding: "10px",
          width: "100%",
        }}
      >
        {/* EXEMPLO DA NOVA INPUTBOX */}
        <div className="inputBox">
          <label>N/O</label>
          <input type="text" placeholder="(automático)" />
        </div>

        <div className="inputBox">
          <label>ReqF</label>
          <input type="text" name="req_f" />
        </div>

        <div className="inputBox">
          <label>Cliente</label>
          <input type="text" />
        </div>

        <div className="inputBox">
          <label>Data Entrada</label>
          <input type="date" step="0.01" name="data_entrada" />
        </div>

        <div className="inputBox">
          <label>Data Pagamento</label>
          <input type="date" step="0.01" name="data_pagamento" />
        </div>

        <div className="inputBox">
          <label>DU Nº</label>
          <input type="number" step="0.01" name="du_numero" />
        </div>

        <div className="inputBox">
          <label>BL Nº</label>
          <input type="number" step="0.01" name="bl_numero" />
        </div>
        <div className="inputBox">
          <label>C/Marca</label>
          <input type="text" step="0.01" name="c_marca" />
        </div>

        <div className="inputBox">
          <label>CRF ou</label>
          <input type="text" step="0.01" name="crf_ou_f" />
        </div>

        <div className="inputBox">
          <label>Factura Nº</label>
          <input type="text" step="0.01" name="factura" />
        </div>

        <div className="inputBox">
          <label>Fob</label>
          <input type="number" step="0.01" name="fob" />
        </div>

        <div className="inputBox">
          <label>Frete</label>
          <input type="number" step="0.01" placeholder="0.00" name="frete" />
        </div>

        <div className="inputBox">
          <label>Seguro</label>
          <input type="number" step="0.01" placeholder="0.00" name="seguro" />
        </div>

        <div className="inputBox">
          <label>CIF</label>
          <input type="number" step="0.01" placeholder="0.00" name="cif" />
        </div>

        <div className="inputBox">
          <label>Via</label>
          <select name="" id=""></select>
        </div>

        <div className="inputBox">
          <label>Consignação</label>
          <input type="text" step="0.01" name="consignatario" />
        </div>

        <div className="inputBox">
          <label>País</label>
          <select name="pais_id" id=""></select>
        </div>

        <div className="inputBox">
          <label>Moeda</label>
          <select name="moeda_id" id="" ></select>
        </div>

        <div className="inputBox">
          <label>Câmbio</label>
          <input type="number" step="0.01" name="cambio" />
        </div>

        <div className="inputBox">
          <label>Valor Aduaneiro</label>
          <input type="number" step="0.01" name="valor_aduaneiro" />
        </div>

        <div className="inputBox">
          <label>Designação</label>
          <input type="text" step="0.01" name="designacao" />
        </div>
        <div className="inputBox">
          <label>Câmbio USD</label>
          <input type="number" step="0.01" name="cambio_usd" />
        </div>
        <div className="inputBox">
          <label>Imposto</label>
          <input type="number" step="0.01" placeholder="0.00" name="imposto_s_impo" />
        </div>
        <div className="inputBox">
          <label>IVA</label>
          <input type="number" step="0.01" name="iva" />
        </div>
        <div className="inputBox">
          <label>Emolumentos Gerais</label>
          <input type="number" step="0.01" placeholder="0.00" name="emolumentos_gerais" />
        </div>
        <div className="inputBox">
          <label>Multas CRF ou Atraso</label>
          <input type="number" step="0.01" placeholder="0.00" name="multas_crf" />
        </div>
        <div className="inputBox">
          <label>Sub Total</label>
          <input type="number" step="0.01" placeholder="0.00" name="subtotal" />
        </div>
        <div className="inputBox">
          <label>EP 17</label>
          <input type="number" step="0.01" placeholder="0.00" name="ep17" />
        </div>
        <div className="inputBox">
          <label>Veterinário / Saúde</label>
          <input type="number" step="0.01" placeholder="0.00" name="veterinario_saude" />
        </div>
        <div className="inputBox">
          <label>Validação do BL</label>
          <input type="number" step="0.01" placeholder="0.00" name="validacao_bl" />
        </div>
        <div className="inputBox">
          <label>Assistência</label>
          <input type="number" step="0.01" placeholder="0.00" name="assistencia" />
        </div>
        <div className="inputBox">
          <label>Deslocação</label>
          <input type="number" step="0.01" placeholder="0.00" name="deslocacao" />
        </div>
        <div className="inputBox">
          <label>Sub-Total</label>
          <input type="number" step="0.01" placeholder="0.00" name="" />
        </div>
        <div className="inputBox">
          <label>DU</label>
          <input type="number" step="0.01" placeholder="0.00" />
        </div>
        <div className="inputBox">
          <label>Licenciamento</label>
          <input type="number" step="0.01" placeholder="0.00" />
        </div>
        <div className="inputBox">
          <label>Declaração de Valor</label>
          <input type="number" step="0.01" placeholder="0.00" />
        </div>
        <div className="inputBox">
          <label>Modelo O</label>
          <input type="number" step="0.01" placeholder="0.00" name="modelo0" />
        </div>
        <div className="inputBox">
          <label>Fotocópias</label>
          <input type="number" step="0.01" placeholder="0.00" name="fotocopias" />
        </div>
        <div className="inputBox">
          <label>T Emolumentos</label>
          <input type="number" step="0.01" placeholder="0.00" name="t_emolument" />
        </div>
        <div className="inputBox">
          <label>Sub Totoal</label>
          <input type="number" step="0.01" placeholder="0.00" />
        </div>
        <div className="inputBox">
          <label>Total Geral</label>
          <input type="number" step="0.01" placeholder="0.00" name="total_geral" />
        </div>
        {/* TEXTO POR EXTENSO */}
        <div style={{ gridColumn: "1 / span 4" }}>
          <label>Texto por Extenso</label>
          <textarea rows={3} style={{ width: "100%" }} name="total_por extenso" />
        </div>
      </form>
    </div>
  );
}
