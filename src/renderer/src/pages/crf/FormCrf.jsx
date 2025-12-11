import { Dialog, DialogContent } from "@mui/material";
import FormDataCRF from "../../components/elements/FormCrf";

export default function FormCRF() {
  return (
    <Dialog open maxWidth="xl" fullWidth>
      <DialogContent sx={{ maxWidth: "100%", maxHeight: "80%" }}>
        <div style={{ marginBottom: 12 }}>
          <span> Nova Requisição</span>
        </div>

        <FormDataCRF />
      </DialogContent>
    </Dialog>
  )
}