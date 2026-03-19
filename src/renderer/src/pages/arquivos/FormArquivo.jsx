import { Dialog, DialogContent } from "@mui/material";
import FormArquivo from "../../components/elements/FormArquivo";

export default function FormArquivoDialog({ isOpen, onClose, onSaved, arquivoId }) {
  return (
    <Dialog open={isOpen} maxWidth="lg" fullWidth>
      <DialogContent sx={{ maxWidth: "100%", maxHeight: "80%" }}>
        <div style={{ marginBottom: 12 }}>
          <span>{arquivoId ? "Editar Arquivo" : "Novo Arquivo"}</span>
        </div>

        <FormArquivo onClose={onClose} onSaved={onSaved} arquivoId={arquivoId} />
      </DialogContent>
    </Dialog>
  );
}
