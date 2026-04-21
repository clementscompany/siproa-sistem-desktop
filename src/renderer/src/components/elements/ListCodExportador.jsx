import { Dialog, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { CodExportadorApi } from "../../api/CodExportador.api";
import Alert from "../Alert/Alert";
import ConfirmModal from "./ConfirmModal";

const codExportadorApi = new CodExportadorApi();

export default function ListCodExportador({ isOpen, onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ nome: "", codigo: "" });
  const [alert, setAlert] = useState({ open: false, message: "", status: "" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const loadItems = async () => {
    try {
      const data = await codExportadorApi.getAll();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) loadItems();
  }, [isOpen]);

  const handleSave = async () => {
    try {
      if (!formData.nome || !formData.codigo) {
        setAlert({ open: true, message: "Nome e Código são obrigatórios", status: "error" });
        return;
      }
      if (editingItem) {
        await codExportadorApi.update(editingItem.id, formData);
      } else {
        await codExportadorApi.create(formData);
      }
      setOpenForm(false);
      setEditingItem(null);
      setFormData({ nome: "", codigo: "" });
      loadItems();
      setAlert({ open: true, message: "Código de Exportador salvo com sucesso!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao salvar código de exportador", status: "error" });
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDelete;
    try {
      await codExportadorApi.delete(id);
      loadItems();
      setAlert({ open: true, message: "Excluído com sucesso!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao excluir", status: "error" });
    }
    setConfirmDelete({ open: false, id: null });
  };

  const handleEdit = (item, e) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormData({
      nome: item.nome,
      codigo: item.codigo
    });
    setOpenForm(true);
  };

  const filteredItems = items.filter(i =>
    i.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="sm">
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", margin: 0 }}>Códigos de Exportador</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="contained" color="primary" onClick={() => { setEditingItem(null); setFormData({ nome: "", codigo: "" }); setOpenForm(true); }}>
                Novo Código
              </Button>
              <Button variant="outlined" color="error" onClick={onClose}>Fechar</Button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f5f5f5", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Pesquisar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", width: "100%" }}
            />
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>Nenhum item encontrado.</div>
            ) : (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    ":hover": { background: "#f9f9f9" }
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.codigo} - {item.nome}</div>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <IconButton onClick={(e) => handleEdit(item, e)} size="small" color="primary">
                      <i className="bi bi-pencil-square"></i>
                    </IconButton>
                    <IconButton onClick={(e) => handleDelete(item.id, e)} size="small" color="error">
                      <i className="bi bi-trash"></i>
                    </IconButton>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <div style={{ padding: "20px", width: "400px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3>{editingItem ? "Editar Exportador" : "Novo Exportador"}</h3>
          <TextField
            label="Nome do Exportador"
            fullWidth
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <TextField
            label="Código"
            fullWidth
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <Button onClick={() => setOpenForm(false)}>Cancelar</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </Dialog>

      {alert.open && (
        <Alert
          message={alert.message}
          status={alert.status}
          onClose={() => setAlert({ ...alert, open: false })}
        />
      )}

      <ConfirmModal
        isOpen={confirmDelete.open}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este código de exportador? Esta ação não poderá ser desfeita."
        onClose={() => setConfirmDelete({ open: false, id: null })}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

function IconButton({ children, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: color === "primary" ? "#1976d2" : "#d32f2f",
        padding: "5px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center"
      }}
    >
      {children}
    </button>
  );
}
