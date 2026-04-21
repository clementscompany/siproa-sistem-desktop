import { Dialog, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { RegimeApi } from "../../api/Regime.api";
import Alert from "../Alert/Alert";
import ConfirmModal from "./ConfirmModal";

const regimeApi = new RegimeApi();

export default function ListRegime({ isOpen, onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ descricao: "", codigo: "" });
  const [alert, setAlert] = useState({ open: false, message: "", status: "" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const loadData = async () => {
    try {
      const data = await regimeApi.getAll();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) loadData();
  }, [isOpen]);

  const handleSave = async () => {
    if (!formData.descricao || !formData.codigo) {
        setAlert({ open: true, message: "Preencha todos os campos", status: "warning" });
        return;
    }
    try {
      if (editingItem) {
        await regimeApi.update(editingItem.id, formData);
      } else {
        await regimeApi.create(formData);
      }
      setOpenForm(false);
      setEditingItem(null);
      setFormData({ descricao: "", codigo: "" });
      loadData();
      setAlert({ open: true, message: "Regime salvo com sucesso!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao salvar regime", status: "error" });
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDelete;
    try {
      await regimeApi.delete(id);
      loadData();
      setAlert({ open: true, message: "Regime excluído!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao excluir", status: "error" });
    }
    setConfirmDelete({ open: false, id: null });
  };

  const handleEdit = (item, e) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormData({ 
      descricao: item.descricao, 
      codigo: item.codigo 
    });
    setOpenForm(true);
  };

  const filteredItems = items.filter(i => 
    (i.descricao || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.codigo || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="sm">
        <div style={{ padding: "20px", minHeight: 500 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", margin: 0 }}>Regimes Aduaneiros</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="contained" color="primary" onClick={() => { setEditingItem(null); setFormData({ nome_do_regime: "", codigo_do_regime: "" }); setOpenForm(true); }}>
                Novo Regime
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
              style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "14px" }}
            />
          </div>

          <div style={{ maxHeight: "350px", overflowY: "auto" }}>
            {filteredItems.map(item => (
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
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{item.codigo} - {item.descricao}</div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={(e) => handleEdit(item, e)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--primary)" }}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button onClick={(e) => handleDelete(item.id, e)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#d32f2f" }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dialog>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <div style={{ padding: "20px", width: "400px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3>{editingItem ? "Editar Regime" : "Novo Regime"}</h3>
          <TextField 
            label="Código do Regime" 
            fullWidth 
            value={formData.codigo} 
            onChange={(e) => setFormData({...formData, codigo: e.target.value})} 
          />
          <TextField 
            label="Nome do Regime" 
            fullWidth 
            value={formData.descricao} 
            onChange={(e) => setFormData({...formData, descricao: e.target.value})} 
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
        message="Deseja realmente excluir este regime? Esta ação não poderá ser desfeita."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      />
    </>
  );
}
