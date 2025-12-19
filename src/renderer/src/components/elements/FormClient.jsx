import { useState } from "react";
import { ImportadoresApi } from "../../api/Importadores.api";
import Alert from "../Alert/Alert";

const api = new ImportadoresApi();

export default function FormClient({ onClose, onSaved }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...data };
      if (!payload.nome) throw new Error("Nome é obrigatório");
      const res = await api.create(payload);
      setAlertState({ open: true, status: "success", title: "Sucesso", message: "Cliente criado com sucesso" });
      setTimeout(() => {
        setAlertState((p) => ({ ...p, open: false }));
        onSaved?.(res);
        onClose?.();
      }, 1200);
    } catch (error) {
      setAlertState({ open: true, status: "error", title: "Erro", message: error.message || "Falha ao criar cliente" });
      setTimeout(() => setAlertState((p) => ({ ...p, open: false })), 1800);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div className="inputBox">
        <label>Código</label>
        <input name="codigo" value={data.codigo} onChange={handleChange} placeholder="Código do importador" />
      </div>
      <div className="inputBox">
        <label>Nome *</label>
        <input name="nome" value={data.nome} onChange={handleChange} placeholder="Nome do importador" required />
      </div>
      <div className="inputBox">
        <label>NIF</label>
        <input name="nif" value={data.nif} onChange={handleChange} placeholder="NIF" />
      </div>
      <div className="inputBox">
        <label>Morada</label>
        <input name="morada" value={data.morada} onChange={handleChange} placeholder="Endereço" />
      </div>
      <div className="inputBox">
        <label>Nacionalidade</label>
        <input name="nacionalidade" value={data.nacionalidade} onChange={handleChange} placeholder="Nacionalidade" />
      </div>
      <div className="inputBox">
        <label>Telefone</label>
        <input name="telefone" value={data.telefone} onChange={handleChange} placeholder="Telefone" />
      </div>
      <div className="inputBox">
        <label>Email</label>
        <input name="email" value={data.email} onChange={handleChange} placeholder="Email" />
      </div>

      <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button onClick={onClose}>Cancelar</button>
        <button onClick={handleSave} style={{ backgroundColor: "var(--primary)", color: "var(--color-button)" }} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
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
