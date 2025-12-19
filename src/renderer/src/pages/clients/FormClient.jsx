import { Dialog, DialogContent } from "@mui/material";
import FormClient from "../../components/elements/FormClient";

export default function FormClientDialog({ isOpen, onClose, onSaved }) {
  return (
    <Dialog open={isOpen} maxWidth="md" fullWidth>
      <DialogContent>
        <div style={{ marginBottom: 12 }}>
          <span>Novo Cliente</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>Novo Cliente</span>
          <button
            onClick={onClose}
            style={{
              color: "red",
              background: "transparent",
              border: "2px solid red",
              padding: "5px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            Fechar
          </button>
        </div>
        <FormClient onClose={onClose} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
