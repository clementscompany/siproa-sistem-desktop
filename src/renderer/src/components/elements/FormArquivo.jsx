import { useEffect, useState } from "react";
import { ArquivosApi } from "../../api/Arquivos.api";
import { ImportadoresApi } from "../../api/Importadores.api";
import { AnexosApi } from "../../api/Anexos.api";
import Alert from "../Alert/Alert";
import SearchBoxForm from "./SearchInputBox";
import { Dialog, DialogContent } from "@mui/material";

const arquivosApi = new ArquivosApi();
const importadoresApi = new ImportadoresApi();
const anexosApi = new AnexosApi();

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

export default function FormArquivo({ onClose, onSaved, arquivoId }) {
  const [clients, setClients] = useState([]);
  const [openClientSearch, setOpenClientSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [anexos, setAnexos] = useState([]);
  const [pendingUpload, setPendingUpload] = useState({ open: false, file: null });
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    status: "",
    title: "",
  });

  const [data, setData] = useState({
    cliente_id: "",
    cliente_nome: "",
    numero_du: "",
    numero_do_processo: "",
    descricao_da_mercadoia: "",
    situacao: "PENDENTE",
    observacao: "",
    doc_transporte: "",
    guia_contratacao: "",
    numero_lote: "",
    documento_em_falta: "",
    numero_de_certificado: "",
    status: "PENDENTE",
    devolucao_prevista_em: "",
    prazo_dias: "",
    devolvido_em: "",
  });

  const loadAnexos = async (id) => {
    if (!id) return;
    try {
      const arquivo = await arquivosApi.getById(id);
      setAnexos(Array.isArray(arquivo?.anexos) ? arquivo.anexos : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const list = await importadoresApi.getAll();
        setClients(list);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadArquivo = async () => {
      if (!arquivoId) return;
      try {
        const arquivo = await arquivosApi.getById(arquivoId);
        setAnexos(Array.isArray(arquivo?.anexos) ? arquivo.anexos : []);
        setData({
          numero_du: arquivo.numero_du ?? "",
          cliente_id: arquivo.cliente_id ?? "",
          cliente_nome: arquivo.cliente?.nome ?? arquivo.cliente_nome ?? "",
          numero_do_processo: arquivo.numero_do_processo ?? "",
          descricao_da_mercadoia: arquivo.descricao_da_mercadoia ?? "",
          situacao: arquivo.situacao ?? "PENDENTE",
          observacao: arquivo.observacao ?? "",
          doc_transporte: arquivo.doc_transporte ?? "",
          guia_contratacao: arquivo.guia_contratacao ?? "",
          numero_lote: arquivo.numero_lote ?? "",
          documento_em_falta: arquivo.documento_em_falta ?? "",
          numero_de_certificado: arquivo.numero_de_certificado ?? "",
          status: arquivo.status ?? "PENDENTE",
          devolucao_prevista_em: arquivo.devolucao_prevista_em ?? "",
          prazo_dias: arquivo.prazo_dias ?? "",
          devolvido_em: arquivo.devolvido_em ?? "",
        });
      } catch (e) {
        console.error(e);
      }
    };
    loadArquivo();
  }, [arquivoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClientSelected = (c) => {
    setData((prev) => ({
      ...prev,
      cliente_id: c?.id ?? "",
      cliente_nome: c?.nome ?? "",
    }));
    setOpenClientSearch(false);
  };

  const handleClientSaved = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
    handleClientSelected(newClient);
  };

  const handleSelectUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPendingUpload({ open: true, file });
  };

  const handleConfirmUpload = async () => {
    if (!arquivoId || !pendingUpload.file) {
      setPendingUpload({ open: false, file: null });
      return;
    }
    try {
      await anexosApi.upload(arquivoId, pendingUpload.file);
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "Anexo enviado com sucesso",
      });
      setPendingUpload({ open: false, file: null });
      loadAnexos(arquivoId);
    } catch (err) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: err.message || "Falha ao enviar anexo",
      });
      setPendingUpload({ open: false, file: null });
    }
  };

  const handleCancelUpload = () => setPendingUpload({ open: false, file: null });

  const handleDownloadAnexo = async (a) => {
    try {
      const { blob, filename } = await anexosApi.download(a.id);
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

  const handleDeleteAnexo = async (a) => {
    try {
      await anexosApi.delete(a.id);
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "Anexo eliminado com sucesso",
      });
      loadAnexos(arquivoId);
    } catch (err) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: err.message || "Falha ao eliminar anexo",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!data.cliente_id) throw new Error("Cliente é obrigatório");

      const payload = {
        cliente_id: Number(data.cliente_id),
        numero_du: data.numero_du,
        numero_do_processo: data.numero_do_processo,
        descricao_da_mercadoia: data.descricao_da_mercadoia,
        situacao: data.situacao,
        observacao: data.observacao,
        doc_transporte: data.doc_transporte,
        guia_contratacao: data.guia_contratacao,
        numero_lote: data.numero_lote,
        documento_em_falta: data.documento_em_falta,
        numero_de_certificado: data.numero_de_certificado,
        status: data.status,
        devolucao_prevista_em: data.devolucao_prevista_em || null,
        prazo_dias: data.prazo_dias === "" ? null : Number(data.prazo_dias),
        devolvido_em: data.devolvido_em || null,
      };

      let res;
      if (arquivoId) {
        res = await arquivosApi.update(arquivoId, payload);
        setAlertState({
          open: true,
          status: "success",
          title: "Sucesso",
          message: "Arquivo atualizado com sucesso",
        });
      } else {
        res = await arquivosApi.create(payload);
        setAlertState({
          open: true,
          status: "success",
          title: "Sucesso",
          message: "Arquivo criado com sucesso",
        });
      }

      setTimeout(() => {
        setAlertState((p) => ({ ...p, open: false }));
        onSaved?.(res);
        onClose?.();
      }, 900);
    } catch (error) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: error.message || "Falha ao salvar Arquivo",
      });
      setTimeout(() => setAlertState((p) => ({ ...p, open: false })), 1600);
    } finally {
      setSaving(false);
    }
  };

  const inputBoxStyle = { display: "flex", flexDirection: "column", gap: "5px" };
  const inputStyle = {
    padding: "6px 10px",
    border: "1px solid var(--input-border)",
    borderRadius: "var(--radius)",
    fontSize: "13px",
    background: "var(--input)",
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 15,
          padding: "10px 0",
        }}
      >
        <div style={{ ...inputBoxStyle, gridColumn: "1 / -1" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Cliente *
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={data.cliente_nome || ""}
              readOnly
              placeholder="Selecionar cliente"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              onClick={() => setOpenClientSearch(true)}
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--color-button)",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                border: "none",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              Selecionar
            </button>
          </div>
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Nº do Processo
          </label>
          <input
            name="numero_do_processo"
            value={data.numero_do_processo}
            onChange={handleChange}
            placeholder="Número do processo"
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Nº do DU
          </label>
          <input
            name="numero_du"
            value={data.numero_du}
            onChange={handleChange}
            placeholder="Número do DU"
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Doc. Transporte
          </label>
          <input
            name="doc_transporte"
            value={data.doc_transporte}
            onChange={handleChange}
            placeholder="Documento de transporte"
            style={inputStyle}
          />
        </div>

        <div style={{ ...inputBoxStyle, gridColumn: "1 / -1" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Descrição da Mercadoria
          </label>
          <textarea
            name="descricao_da_mercadoia"
            value={data.descricao_da_mercadoia}
            onChange={handleChange}
            placeholder="Descrição"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Situação
          </label>
          <select name="situacao" value={data.situacao} onChange={handleChange} style={inputStyle}>
            <option value="PENDENTE">PENDENTE</option>
            <option value="CONCLUIDO">CONCLUIDO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Status
          </label>
          <select name="status" value={data.status} onChange={handleChange} style={inputStyle}>
            <option value="PENDENTE">PENDENTE</option>
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Data prevista de devolução
          </label>
          <input
            type="date"
            name="devolucao_prevista_em"
            value={data.devolucao_prevista_em || ""}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Prazo (dias)
          </label>
          <input
            type="number"
            min={0}
            name="prazo_dias"
            value={data.prazo_dias ?? ""}
            onChange={handleChange}
            placeholder="Ex.: 7"
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Devolvido em
          </label>
          <input
            type="date"
            name="devolvido_em"
            value={data.devolvido_em || ""}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Guia de Contratação
          </label>
          <input
            name="guia_contratacao"
            value={data.guia_contratacao}
            onChange={handleChange}
            placeholder="Guia"
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Número do Lote
          </label>
          <input
            name="numero_lote"
            value={data.numero_lote}
            onChange={handleChange}
            placeholder="Lote"
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Documento em Falta
          </label>
          <input
            name="documento_em_falta"
            value={data.documento_em_falta}
            onChange={handleChange}
            placeholder="Documento"
            style={inputStyle}
          />
        </div>

        <div style={inputBoxStyle}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Nº de Certificado
          </label>
          <input
            name="numero_de_certificado"
            value={data.numero_de_certificado}
            onChange={handleChange}
            placeholder="Certificado"
            style={inputStyle}
          />
        </div>

        <div style={{ ...inputBoxStyle, gridColumn: "1 / -1" }}>
          <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>
            Observação
          </label>
          <textarea
            name="observacao"
            value={data.observacao}
            onChange={handleChange}
            placeholder="Observações"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Anexos</span>
            {arquivoId ? (
              <label
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--color-button)",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: "none",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                Upload
                <input type="file" style={{ display: "none" }} onChange={handleSelectUpload} />
              </label>
            ) : null}
          </div>

          {!arquivoId ? (
            <div style={{ marginTop: 8, color: "var(--text2)", fontSize: 13 }}>
              Salve o arquivo primeiro para anexar documentos.
            </div>
          ) : (
            <div style={{ marginTop: 10, border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              {anexos.length === 0 ? (
                <div style={{ padding: 12, color: "var(--text2)" }}>Nenhum anexo.</div>
              ) : (
                anexos.map((a) => (
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
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {a.nome_do_arquivo}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text2)" }}>{a.tipo_de_arquivo || "—"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleDownloadAnexo(a)}
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
          )}
        </div>

        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "5px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "1px solid var(--border)",
              background: "var(--button)",
              fontSize: "13px",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--color-button)",
              padding: "5px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              border: "none",
              fontSize: "13px",
              opacity: saving ? 0.8 : 1,
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      <SearchBoxForm
        isOpen={openClientSearch}
        onClose={() => setOpenClientSearch(false)}
        checkedValue={handleClientSelected}
        data={clients}
        onClientSaved={handleClientSaved}
      />

      {alertState.open === true && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={() => setAlertState((p) => ({ ...p, open: false }))}
        />
      )}

      <Dialog
        open={pendingUpload.open}
        onClose={handleCancelUpload}
        maxWidth="xs"
        fullWidth
        sx={{ zIndex: (theme) => theme.zIndex.modal + 10 }}
      >
        <DialogContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Confirmar envio</span>
            <button
              onClick={handleCancelUpload}
              style={{
                color: "red",
                background: "transparent",
                border: "2px solid red",
                padding: "5px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Fechar
            </button>
          </div>

          <div style={{ color: "var(--text)", fontSize: 13 }}>
            Enviar o anexo <b>{pendingUpload.file?.name}</b>?
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
            <button
              onClick={handleCancelUpload}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                border: "1px solid var(--border)",
                background: "var(--button)",
                fontSize: "13px",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmUpload}
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--color-button)",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                border: "none",
                fontSize: "13px",
              }}
            >
              Enviar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
