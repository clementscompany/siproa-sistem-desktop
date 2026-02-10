import { Dialog } from "@mui/material";
import { useState } from "react";
import { PAISES_MUNDO } from "../../constants/paises";
import "./style.css";

export default function SearchBoxPaises({ isOpen, checkedValue, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar países baseado no termo de pesquisa (sem useMemo - dados estáticos)
  let filteredPaises = PAISES_MUNDO;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredPaises = PAISES_MUNDO.filter(
      (pais) =>
        (pais.name?.common || "").toLowerCase().includes(term) ||
        (pais.name?.official || "").toLowerCase().includes(term) ||
        (pais.cca2 || "").toLowerCase().includes(term)
    );
  }

  const handleSelectPais = (pais) => {
    if (checkedValue) {
      checkedValue({
        id: pais.cca2,
        nome: pais.name?.common || "",
        codigo: pais.cca2 || "",
        nomeOficial: pais.name?.official || "",
        bandeira: pais.flags?.png || pais.flags?.svg || "",
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm">
      <div style={{ width: "100%", padding: 16 }}>
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "var(--primary)" }}>Selecionar País</h3>
          <button
            style={{
              color: "red",
              border: "2px solid var(--error-bg)",
              backgroundColor: "transparent",
              padding: "5px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        {/* INPUT DE PESQUISA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f5f5f5",
            padding: "12px 14px",
            borderRadius: "10px",
            marginBottom: "14px",
          }}
        >
          <i
            className="bi bi-search"
            style={{
              fontSize: "18px",
              color: "#666",
            }}
          />
          <input
            type="search"
            placeholder="Pesquisar país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </div>

        {/* LISTA DE PAÍSES */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {filteredPaises.length > 0 ? (
            filteredPaises.map((pais, index) => (
              <li
                key={pais.cca2 || index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onClick={() => handleSelectPais(pais)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f7ff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 500, fontSize: "14px" }}>{pais.name?.common || "N/A"}</span>
                    <span style={{ fontSize: "12px", color: "#666" }}>{pais.cca2 || ""}</span>
                  </div>
                </div>
                <i className="bi bi-chevron-right" style={{ color: "#999" }}></i>
              </li>
            ))
          ) : (
            <li style={{ padding: "20px", textAlign: "center", color: "#999" }}>
              Nenhum país encontrado.
            </li>
          )}
        </ul>
      </div>
    </Dialog>
  );
}
