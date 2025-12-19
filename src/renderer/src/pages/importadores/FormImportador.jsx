import { Dialog, DialogContent } from "@mui/material";
import FormImportador from "../../components/elements/FormImportador";

export default function FormImportadorDialog({ isOpen, onClose, onSaved, importador }) {
  return (
    <Dialog open={isOpen} maxWidth="md" fullWidth>
      <DialogContent>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text)" }}>
            {importador ? "Editar Importador" : "Cadastrar Importador"}
          </span>
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
        <FormImportador onClose={onClose} onSaved={onSaved} importador={importador} />
      </DialogContent>
    </Dialog>
  );
}

