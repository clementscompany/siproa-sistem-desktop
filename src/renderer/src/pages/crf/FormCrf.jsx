import { Dialog, DialogContent } from "@mui/material";
import FormDataCRF from "../../components/elements/FormCrf";
import { useState } from "react";

export default function FormCRF({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} maxWidth="xl" fullWidth >
      <DialogContent sx={{ maxWidth: "100%", maxHeight: "80%" }}>
        <div style={{ marginBottom: 12 }}>
          <span> Nova Requisição</span>
        </div>

        <FormDataCRF onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}