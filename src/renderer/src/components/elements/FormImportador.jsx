import { useState, useEffect } from "react";
import { ImportadoresApi } from "../../api/Importadores.api";
import Alert from "../Alert/Alert";

const api = new ImportadoresApi();

export default function FormImportador({ onClose, onSaved, importador }) {
  const [data, setData] = useState({
    nome: "",
    nif: "",
    morada: "",
    nacionalidade: "",
    telefone: "",
    email: "",
    codigo: "",
  });

  const [alertState, setAlertState] = useState({ open: false, message: "", status: "", title: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (importador) {
      setData({
        nome: importador.nome || "",
        nif: importador.nif || "",
        morada: importador.morada || "",
        nacionalidade: importador.nacionalidade || "",
        telefone: importador.telefone || "",
        email: importador.email || "",
        codigo: importador.codigo || "",
      });
    }
  }, [importador]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...data };
      if (!payload.nome) throw new Error("Nome é obrigatório");

      let res;
      if (importador) {
        res = await api.update(importador.id, payload);
        setAlertState({ open: true, status: "success", title: "Sucesso", message: "Cliente atualizado com sucesso" });
      } else {
        res = await api.create(payload);
        setAlertState({ open: true, status: "success", title: "Sucesso", message: "Cliente criado com sucesso" });
      }

      setTimeout(() => {
        setAlertState((p) => ({ ...p, open: false }));
        onSaved?.(res);
        onClose?.();
      }, 1200);
    } catch (error) {
      setAlertState({ open: true, status: "error", title: "Erro", message: error.message || "Falha ao salvar cliente" });
      setTimeout(() => setAlertState((p) => ({ ...p, open: false })), 1800);
    } finally {
      setSaving(false);
    }
  };

  const inputBoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 15,
      padding: "10px 0"
    }}>
      <div style={inputBoxStyle}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Código</label>
        <input
          name="codigo"
          value={data.codigo}
          onChange={handleChange}
          placeholder="Código do cliente"
          style={{
            padding: "6px 10px",
            border: "1px solid var(--input-border)",
            borderRadius: "var(--radius)",
            fontSize: "13px",
            background: "var(--input)"
          }}
        />
      </div>
      <div style={inputBoxStyle}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Nome *</label>
        <input
          name="nome"
          value={data.nome}
          onChange={handleChange}
          placeholder="Nome do cliente"
          required
          style={{
            padding: "6px 10px",
            border: "1px solid var(--input-border)",
            borderRadius: "var(--radius)",
            fontSize: "13px",
            background: "var(--input)"
          }}
        />
      </div>
      <div style={inputBoxStyle}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>NIF</label>
        <input
          name="nif"
          value={data.nif}
          onChange={handleChange}
          placeholder="NIF"
          style={{
            padding: "6px 10px",
            border: "1px solid var(--input-border)",
            borderRadius: "var(--radius)",
            fontSize: "13px",
            background: "var(--input)"
          }}
        />
      </div>
      <div style={inputBoxStyle}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Morada</label>
        <input
          name="morada"
          value={data.morada}
          onChange={handleChange}
          placeholder="Endereço"
          style={{
            padding: "6px 10px",
            border: "1px solid var(--input-border)",
            borderRadius: "var(--radius)",
            fontSize: "13px",
            background: "var(--input)"
          }}
        />
      </div>
      <div style={inputBoxStyle}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Nacionalidade</label>
        <input
          name="nacionalidade"
          value={data.nacionalidade}
          onChange={handleChange}
          placeholder="Nacionalidade"
          style={{
            padding: "6px 10px",
            border: "1px solid var(--input-border)",
            borderRadius: "var(--radius)",
            fontSize: "13px",
            background: "var(--input)"
          }}
        />
      </div>
      <div style={inputBoxStyle}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Telefone</label>
        <input
          name="telefone"
          value={data.telefone}
          onChange={handleChange}
          placeholder="Telefone"
          style={{
            padding: "6px 10px",
            border: "1px solid var(--input-border)",
            borderRadius: "var(--radius)",
            fontSize: "13px",
            background: "var(--input)"
          }}
        />
      </div>
      <div style={{ ...inputBoxStyle, gridColumn: "1 / -1" }}>
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", marginBottom: "4px" }}>Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
          style={{
            padding: "6px 10px",
            border: "1px solid var(--input-border)",
            borderRadius: "var(--radius)",
            fontSize: "13px",
            background: "var(--input)"
          }}
        />
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
            fontSize: "13px"
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--color-button)",
            padding: "5px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
            fontSize: "13px"
          }}
          disabled={saving}
        >
          {saving ? "Salvando..." : importador ? "Atualizar" : "Salvar"}
        </button>
      </div>

      {alertState.open === true && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={() => setAlertState((p) => ({ ...p, open: false }))}
        />
      )}
    </div>
  );
}

