import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, Button } from "@mui/material";
import { ArquivosApi } from "../../api/Arquivos.api";
import { systemApi } from "../../api/System.api";
import NotaArquivo from "../../pages/arquivos/NotaArquivo";
import Alert from "../Alert/Alert";
import "./TableArquivos.css";

const api = new ArquivosApi();
const sysApi = new systemApi();

export default function TableArquivos({ onViewDetails, onEdit, reload }) {
  const [data, setData] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [notaState, setNotaState] = useState({
    open: false,
    tipo: null,
    arquivo: null,
    responsavel: null,
  });
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    status: "",
    title: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, item: null });

  const fetchData = async () => {
    try {
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      console.error("Erro ao buscar Arquivos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const root = document.getElementById("root");
    if (notaState.open && root) {
      root.setAttribute("inert", "");
    }
    return () => {
      if (root) root.removeAttribute("inert");
    };
  }, [notaState.open]);

  const parseDateEndLocalMs = (value) => {
    if (!value) return null;
    const s = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const d = new Date(`${s}T23:59:59.999`);
      return Number.isNaN(d.getTime()) ? null : d.getTime();
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  };

  const getPrazoClass = (dias) => {
    if (dias <= 2) return "prazo prazo-curto";
    if (dias <= 7) return "prazo prazo-medio";
    return "prazo prazo-longo";
  };

  const handleView = (item) => onViewDetails?.(item);
  const handleEdit = (item) => onEdit?.(item);
  const handleDelete = (item) => setConfirmDelete({ open: true, item });

  const handleCancelDelete = () => setConfirmDelete({ open: false, item: null });

  const getResponsavel = async () => {
    try {
      const cfg = await sysApi.getConfigApp();
      return cfg?.result?.[0]?.admin_usuario || "—";
    } catch {
      return "—";
    }
  };

  const handleExportPdfNota = async () => {
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.querySelector(".nota-container");
      if (!element) return;

      const waitForNoteReady = async () => {
        const start = Date.now();
        while (Date.now() - start < 2500) {
          if (element.getAttribute("data-note-ready") === "1") return;
          await new Promise((r) => setTimeout(r, 50));
        }
      };

      await waitForNoteReady();

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

      const tipo = notaState.tipo === "DEVOLUCAO" ? "DEVOLUCAO" : "ENTREGA";
      const filename = `${tipo}-${notaState.arquivo?.numero_do_processo || "ARQUIVO"}.pdf`;

      const opt = {
        margin: 10,
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Erro ao exportar PDF", error);
    }
  };

  const handleEmprestar = async (item) => {
    try {
      const [arquivo, responsavel] = await Promise.all([api.getById(item.id), getResponsavel()]);
      await api.emprestar(item.id);
      setNotaState({ open: true, tipo: "ENTREGA", arquivo, responsavel });

      fetchData();
    } catch (error) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: error.message || "Falha ao emprestar",
      });
    }
  };

  const handleDevolver = async (item) => {
    try {
      const [arquivo, responsavel] = await Promise.all([api.getById(item.id), getResponsavel()]);
      await api.devolver(item.id);
      setNotaState({ open: true, tipo: "DEVOLUCAO", arquivo, responsavel });

      fetchData();
    } catch (error) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: error.message || "Falha ao devolver",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.item) return;
    try {
      await api.delete(confirmDelete.item.id);
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "Arquivo eliminado com sucesso",
      });
      setConfirmDelete({ open: false, item: null });
      fetchData();
    } catch (error) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: "Falha ao eliminar Arquivo",
      });
      setConfirmDelete({ open: false, item: null });
    }
  };

  return (
    <>
      <div className="table-wrapper card">
        <table className="table-arquivos">
          <thead>
            <tr>
              <th>Nº DU</th>
              <th>Nº Processo</th>
              <th>Cliente</th>
              <th>Doc Transporte</th>
              <th>Tempo</th>
              <th>Situação</th>
              <th>Status</th>
              <th className="actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td className="truncate">{item.numero_du || "—"}</td>
                <td className="truncate">{item.numero_do_processo || "—"}</td>
                <td className="truncate">{item.cliente_nome || "—"}</td>
                <td className="truncate">{item.doc_transporte || "—"}</td>
                <td>
                  {item.devolucao_prevista_em && !item.devolvido_em ? (
                    (() => {
                      const dueMs = parseDateEndLocalMs(item.devolucao_prevista_em);
                      if (dueMs == null) return <span className="muted">—</span>;
                      const dias = Math.max(
                        0,
                        Math.ceil((dueMs - now) / (24 * 60 * 60 * 1000)),
                      );
                      return (
                        <span className={getPrazoClass(dias)}>
                          Faltam {dias} {dias === 1 ? "dia" : "dias"}
                        </span>
                      );
                    })()
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td>
                  <span className={`status ${(item.situacao || "PENDENTE").toLowerCase()}`}>
                    {item.situacao || "PENDENTE"}
                  </span>
                </td>
                <td>
                  <span className={`status ${(item.status || "PENDENTE").toLowerCase()}`}>
                    {item.status || "PENDENTE"}
                  </span>
                </td>
                <td className="actions">
                  <button
                    title="Emprestar"
                    onClick={() => handleEmprestar(item)}
                    className="btn-action btn-emprestar"
                  >
                    <i className="bi bi-box-arrow-right" /> Emprestar
                  </button>
                  <button
                    title="Devolver"
                    onClick={() => handleDevolver(item)}
                    className="btn-action btn-devolver"
                  >
                    <i className="bi bi-box-arrow-in-left" /> Devolver
                  </button>
                  <button title="Ver" onClick={() => handleView(item)}>
                    <i className="bi bi-eye" />
                  </button>
                  <button title="Editar" onClick={() => handleEdit(item)}>
                    <i className="bi bi-pencil-square" />
                  </button>
                  <button title="Eliminar" onClick={() => handleDelete(item)}>
                    <i className="bi bi-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {alertState.open === true && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={() => setAlertState((p) => ({ ...p, open: false }))}
        />
      )}

      {confirmDelete.open && confirmDelete.item && (
        <Alert
          message={`Tem certeza que deseja eliminar o Arquivo "${confirmDelete.item.numero_do_processo || confirmDelete.item.id}"?`}
          status="warring"
          title="Confirmar Eliminação"
          showCancellButton={true}
          cancelMessage="Cancelar"
          confirmMessage="Eliminar"
          onClose={handleConfirmDelete}
          onCancell={handleCancelDelete}
        />
      )}

      <Dialog open={notaState.open} maxWidth="md" fullWidth onClose={() => setNotaState({ open: false, tipo: null, arquivo: null, responsavel: null })}>
        <DialogContent>
          {notaState.arquivo && (
            <NotaArquivo tipo={notaState.tipo} arquivo={notaState.arquivo} responsavel={notaState.responsavel} />
          )}
        </DialogContent>
        <DialogActions className="no-print">
          <Button onClick={() => window.print()} variant="outlined" autoFocus>
            Imprimir
          </Button>
          <Button onClick={handleExportPdfNota} variant="contained">
            Exportar PDF
          </Button>
          <Button onClick={() => setNotaState({ open: false, tipo: null, arquivo: null, responsavel: null })} color="error">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
