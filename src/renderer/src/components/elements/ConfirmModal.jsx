import { Dialog, Button } from "@mui/material";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div style={{ padding: "24px", minWidth: "350px", textAlign: "center" }}>
        <div style={{ fontSize: "40px", color: "var(--warning)", marginBottom: "16px" }}>
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: 700 }}>{title || "Confirmar"}</h3>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#666", lineHeight: "1.5" }}>
          {message || "Tem certeza que deseja realizar esta ação?"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              background: "#f5f5f5",
              border: "1px solid #ddd",
              padding: "10px 24px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              background: "var(--error-bg)",
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </Dialog>
  );
}
