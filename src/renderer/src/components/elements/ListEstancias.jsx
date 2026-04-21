import { Dialog, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { EstanciasApi } from "../../api/Estancias.api";
import Alert from "../Alert/Alert";
import ConfirmModal from "./ConfirmModal";

const estanciasApi = new EstanciasApi();

export default function ListEstancias({ isOpen, onClose, onSelect }) {
  const [estancias, setEstancias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingEstancia, setEditingEstancia] = useState(null);
  const [formData, setFormData] = useState({ nome: "", codigo: "", localizacao: "" });
  const [alert, setAlert] = useState({ open: false, message: "", status: "" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const loadEstancias = async () => {
    try {
      const data = await estanciasApi.getAll();
      setEstancias(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) loadEstancias();
  }, [isOpen]);

  const handleSave = async () => {
    try {
      if (!formData.nome) {
        setAlert({ open: true, message: "O nome é obrigatório", status: "error" });
        return;
      }
      if (editingEstancia) {
        await estanciasApi.update(editingEstancia.id, formData);
      } else {
        await estanciasApi.create(formData);
      }
      setOpenForm(false);
      setEditingEstancia(null);
      setFormData({ nome: "", codigo: "", localizacao: "" });
      loadEstancias();
      setAlert({ open: true, message: "Estância salva com sucesso!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao salvar estância", status: "error" });
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDelete;
    try {
      await estanciasApi.delete(id);
      loadEstancias();
      setAlert({ open: true, message: "Excluída com sucesso!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao excluir", status: "error" });
    }
    setConfirmDelete({ open: false, id: null });
  };

  const handleEdit = (estancia, e) => {
    e.stopPropagation();
    setEditingEstancia(estancia);
    setFormData({ 
      nome: estancia.nome, 
      codigo: estancia.codigo || "", 
      localizacao: estancia.localizacao || "" 
    });
    setOpenForm(true);
  };

  const filteredEstancias = estancias.filter(e => 
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="sm">
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", margin: 0 }}>Estâncias Aduaneiras</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="contained" color="primary" onClick={() => { setEditingEstancia(null); setFormData({ nome: "", codigo: "", localizacao: "" }); setOpenForm(true); }}>
                Nova Estância
              </Button>
              <Button variant="outlined" color="error" onClick={onClose}>Fechar</Button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f5f5f5", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>
            <i className="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="Pesquisar estância..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", width: "100%" }}
            />
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {filteredEstancias.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>Nenhuma estância encontrada.</div>
            ) : (
              filteredEstancias.map(estancia => (
                <div 
                  key={estancia.id} 
                  onClick={() => onSelect(estancia)}
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
                    <div style={{ fontWeight: 600 }}>{estancia.nome}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {estancia.codigo && `Cód: ${estancia.codigo}`} 
                      {estancia.codigo && estancia.localizacao && " | "} 
                      {estancia.localizacao && `Local: ${estancia.localizacao}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <IconButton onClick={(e) => handleEdit(estancia, e)} size="small" color="primary">
                      <i className="bi bi-pencil-square"></i>
                    </IconButton>
                    <IconButton onClick={(e) => handleDelete(estancia.id, e)} size="small" color="error">
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
          <h3>{editingEstancia ? "Editar Estância" : "Nova Estância"}</h3>
          <TextField 
            label="Nome da Estância" 
            fullWidth 
            value={formData.nome} 
            onChange={(e) => setFormData({...formData, nome: e.target.value})} 
          />
          <TextField 
            label="Código" 
            fullWidth 
            value={formData.codigo} 
            onChange={(e) => setFormData({...formData, codigo: e.target.value})} 
          />
          <TextField 
            label="Localização" 
            fullWidth 
            value={formData.localizacao} 
            onChange={(e) => setFormData({...formData, localizacao: e.target.value})} 
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
        message="Deseja realmente excluir esta estância? Esta ação não poderá ser desfeita."
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
