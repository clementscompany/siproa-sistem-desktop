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

        <button style={{backGroundColor:"red"}} >
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
          <input type="text" />
        </div>
        
        <div className="inputBox">
          <label>ReqF</label>
          <input type="text" />
        </div>

        <div className="inputBox">
          <label>Seguro</label>
          <input type="number" step="0.01" />
        </div>

        <div className="inputBox">
          <label>IVA</label>
          <input type="number" step="0.01" />
        </div>

        <div className="inputBox">
          <label>Exemplo </label>
          <input type="number" step="0.01" />
        </div>


        {/* TEXTO POR EXTENSO */}
        <div style={{ gridColumn: "1 / span 4" }}>
          <label>Texto por Extenso</label>
          <textarea rows={3} style={{ width: "100%" }} />
        </div>
      </form>
    </div>
  );
}
