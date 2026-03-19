import { Dialog, DialogContent } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { ArquivosApi } from "../../api/Arquivos.api";
import { AnexosApi } from "../../api/Anexos.api";
import Alert from "../../components/Alert/Alert";

const arquivosApi = new ArquivosApi();
const anexosApi = new AnexosApi();

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

const formatDatePt = (value) => {
  if (!value) return "—";
  const s = String(value);
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T12:00:00`) : new Date(s);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export default function ArquivoDetailsView({ open, arquivoId, onClose }) {
  const fileInputRef = useRef(null);
  const [data, setData] = useState(null);
  const now = Date.now();
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    status: "",
    title: "",
  });

  const load = async () => {
    if (!arquivoId) return;
    try {
      const arquivo = await arquivosApi.getById(arquivoId);
      setData(arquivo);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (open) load();
  }, [open, arquivoId]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !arquivoId) return;

    try {
      await anexosApi.upload(arquivoId, file);
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "Anexo enviado com sucesso",
      });
      load();
    } catch (err) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: err.message || "Falha ao enviar anexo",
      });
    }
  };

  const handleDownload = async (anexo) => {
    try {
      const { blob, filename } = await anexosApi.download(anexo.id);
      downloadBlob(blob, filename);
    } catch (err) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: err.message || "Falha ao baixar anexo",
      });
    }
  };

  const handleDeleteAnexo = async (anexo) => {
    try {
      await anexosApi.delete(anexo.id);
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "Anexo eliminado com sucesso",
      });
      load();
    } catch (err) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: err.message || "Falha ao eliminar anexo",
      });
    }
  };

  return (
    <>
      <Dialog open={open} maxWidth="md" fullWidth onClose={onClose}>
        <DialogContent>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>Detalhes do Arquivo</span>
            <button
              onClick={onClose}
              style={{
                color: "red",
                background: "transparent",
                border: "2px solid red",
                padding: "5px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Fechar
            </button>
          </div>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Cliente</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.cliente?.nome || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Nº Processo</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.numero_do_processo || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Nº DU</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.numero_du || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Doc Transporte</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.doc_transporte || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Status</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.status || "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Devolução prevista</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{formatDatePt(data?.devolucao_prevista_em)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Prazo (dias)</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.prazo_dias ?? "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Devolvido em</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{formatDatePt(data?.devolvido_em)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Situação da devolução</div>
              {(() => {
                const dueMs = parseDateEndLocalMs(data?.devolucao_prevista_em);
                const returnedMs = parseDateEndLocalMs(data?.devolvido_em);
                const vencido = dueMs != null && returnedMs == null && now > dueMs;
                if (returnedMs != null) {
                  return <div style={{ fontSize: 14, color: "var(--success-text)" }}>DEVOLVIDO</div>;
                }
                if (vencido) {
                  return <div style={{ fontSize: 14, color: "var(--error-text)" }}>ATRASADO</div>;
                }
                if (dueMs != null) {
                  const dias = Math.ceil((dueMs - now) / (24 * 60 * 60 * 1000));
                  return <div style={{ fontSize: 14, color: "var(--warning-text)" }}>FALTAM {Math.max(0, dias)}d</div>;
                }
                return <div style={{ fontSize: 14, color: "var(--text)" }}>SEM PRAZO</div>;
              })()}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Descrição da Mercadoria</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.descricao_da_mercadoia || "—"}</div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>Observação</div>
              <div style={{ fontSize: 14, color: "var(--text)" }}>{data?.observacao || "—"}</div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Anexos</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleUploadClick}
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--color-button)",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: "none",
                  fontSize: "13px",
                }}
              >
                Upload
              </button>
            </div>
          </div>

          <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleUpload} />

          <div style={{ marginTop: 10, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            {(data?.anexos || []).length === 0 ? (
              <div style={{ padding: 12, color: "var(--text2)" }}>Nenhum anexo.</div>
            ) : (
              (data?.anexos || []).map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                    borderBottom: "1px solid var(--border)",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {a.nome_do_arquivo}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{a.tipo_de_arquivo || "—"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleDownload(a)}
                      style={{
                        background: "var(--button)",
                        border: "1px solid var(--border)",
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteAnexo(a)}
                      style={{
                        background: "transparent",
                        border: "1px solid var(--error-bg)",
                        color: "var(--error-text)",
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {alertState.open === true && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={() => setAlertState((p) => ({ ...p, open: false }))}
        />
      )}
    </>
  );
}
