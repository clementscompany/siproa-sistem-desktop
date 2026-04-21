import { Dialog, DialogContent } from "@mui/material";
import FormProcessos from "../../components/elements/FormProcessos";

export default function FormProcessoDialog({ isOpen, onClose, onSaved, processoId }) {
  return (
    <Dialog open={isOpen} maxWidth="lg" fullWidth>
      <DialogContent sx={{ maxWidth: "100%", maxHeight: "80%" }}>
        <div style={{ marginBottom: 12, fontSize: "18px", fontWeight: "bold", color: "var(--primary)" }}>
          <span>{processoId ? "Editar Processo" : "Novo Processo"}</span>
        </div>

        <FormProcessos onClose={onClose} onSaved={onSaved} processoId={processoId} />
      </DialogContent>
    </Dialog>
  );
}
