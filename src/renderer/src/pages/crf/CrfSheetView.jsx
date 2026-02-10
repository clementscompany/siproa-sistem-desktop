import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { CrfApi } from "../../api/Crf.api";
import SheetCrf from "../../components/elements/SheetCrf";

export default function CrfSheetView({ open, onClose, crfId }) {
  const api = new CrfApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    const root = document.getElementById("root");
    if (open && root) {
      root.setAttribute("inert", "");
    }
    return () => {
      if (root) root.removeAttribute("inert");
    };
  }, [open]);

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
      if (!element) return;

      const waitForSheetReady = async () => {
        const start = Date.now();
        while (Date.now() - start < 2500) {
          if (element.getAttribute("data-sheet-ready") === "1") return;
          await new Promise((r) => setTimeout(r, 50));
        }
      };

      await waitForSheetReady();

      const fontReady = document?.fonts?.ready;
      if (fontReady?.then) {
        await fontReady.catch(() => { });
      }

      const images = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        }),
      );

      const opt = {
        margin: 10,
        filename: `${data?.numero_crf || "CRF"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff" },
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
        <Button onClick={() => window.print()} variant="outlined" autoFocus>Imprimir</Button>
        <Button onClick={handleExportPdf} variant="contained">Exportar PDF</Button>
        <Button onClick={onClose} color="error">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
