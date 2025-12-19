import { Dialog, Button, IconButton } from "@mui/material";
import { useState } from "react";
import "./style.css";
import FormImportadorDialog from "../../pages/importadores/FormImportador";

export default function SearchBoxForm({ isOpen, checkedValue, onClose, data = [], onClientSaved }) {
  const [openFormImportador, setOpenFormImportador] = useState(false);

  const handleImportadorSaved = (newImportador) => {
    setOpenFormImportador(false);
    if (onClientSaved) {
      onClientSaved(newImportador);
    }
    // Auto-select the newly created importador
    if (newImportador && checkedValue) {
      checkedValue({ nome: newImportador.nome, id: newImportador.id });
    }
  };

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="sm">
        <div style={{ width: "100%", padding: 16 }}>
          {/* BOTÃO DE CADASTRAR NO TOPO */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setOpenFormImportador(true)}
              style={{ backgroundColor: "var(--primary)", color: "var(--color-button)", alignItems: "center", display: "flex", gap: "8px", border: "2px solid var(--primary)", padding: "8px 16px", borderRadius: "5px", cursor: "pointer" }}
            >
              <i className="bi bi-plus"></i>
              cadastrar
            </button>

            <button style={{ color: "red", border: "2px solid var(--error-bg)", backgroundColor: "transparent" }} onClick={onClose}>
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
              placeholder="Pesquisar cliente..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                fontSize: "14px",
              }}
            />
          </div>

          {/* LISTA DE CLIENTES */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => checkedValue({ nome: item.nome, id: item.id })}
                >
                  <span>{item.nome}</span>
                  <i className="bi bi-chevron-right" style={{ color: "#999" }}></i>
                </li>
              ))
            ) : (
              <li style={{ padding: "10px", textAlign: "center", color: "#999" }}>
                Nenhum cliente encontrado.
              </li>
            )}
          </ul>
        </div>
      </Dialog>

      <FormImportadorDialog
        isOpen={openFormImportador}
        onClose={() => setOpenFormImportador(false)}
        onSaved={handleImportadorSaved}
      />
    </>
  );
}
