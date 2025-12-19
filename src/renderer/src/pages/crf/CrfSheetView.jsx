import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { CrfApi } from "../../api/Crf.api";
import SheetCrf from "../../components/elements/SheetCrf";

export default function CrfSheetView({ open, onClose, crfId }) {
  const api = new CrfApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!open || !crfId) return;
    (async () => {
      try {
        const json = await api.getById(crfId);
        setData(json);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [open, crfId]);

  const handleExportPdf = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.querySelector(".sheet-container");
      const opt = {
        margin: 10,
        filename: `${data?.numero_crf || "CRF"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Erro ao exportar PDF", error);
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogContent>
        {data && <SheetCrf data={data} visible />}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => window.print()} variant="outlined">Imprimir</Button>
        <Button onClick={handleExportPdf} variant="contained">Exportar PDF</Button>
        <Button onClick={onClose} color="error">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
