import { Dialog, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { BancosApi } from "../../api/Bancos.api";
import Alert from "../Alert/Alert";
import ConfirmModal from "./ConfirmModal";

const bancosApi = new BancosApi();

export default function ListBank({ isOpen, onClose, onSelect }) {
  const [banks, setBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [formData, setFormData] = useState({ nome: "", conta_numero: "", iban: "" });
  const [alert, setAlert] = useState({ open: false, message: "", status: "" });

  const loadBanks = async () => {
    try {
      const data = await bancosApi.getAll();
      setBanks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) loadBanks();
  }, [isOpen]);

  const handleSave = async () => {
    try {
      if (editingBank) {
        await bancosApi.update(editingBank.id, formData);
      } else {
        await bancosApi.create(formData);
      }
      setOpenForm(false);
      setEditingBank(null);
      setFormData({ nome: "", conta_numero: "", iban: "" });
      loadBanks();
      setAlert({ open: true, message: "Banco salvo com sucesso!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao salvar banco", status: "error" });
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setConfirmDelete({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmDelete;
    try {
      await bancosApi.delete(id);
      loadBanks();
      setAlert({ open: true, message: "Excluído com sucesso!", status: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Erro ao excluir", status: "error" });
    }
    setConfirmDelete({ open: false, id: null });
  };

  const handleEdit = (bank, e) => {
    e.stopPropagation();
    setEditingBank(bank);
    setFormData({ nome: bank.nome, conta_numero: bank.conta_numero, iban: bank.iban });
    setOpenForm(true);
  };

  const filteredBanks = banks.filter(b => 
    b.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.conta_numero?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog open={isOpen} fullWidth maxWidth="sm">
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "18px", margin: 0 }}>Detalhes do Banco</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="contained" color="primary" onClick={() => { setEditingBank(null); setFormData({ nome: "", conta_numero: "", iban: "" }); setOpenForm(true); }}>
                Novo Banco
              </Button>
              <Button variant="outlined" color="error" onClick={onClose}>Fechar</Button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f5f5f5", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>
            <i className="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="Pesquisar banco..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", width: "100%" }}
            />
          </div>

          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {filteredBanks.map(bank => (
              <div 
                key={bank.id} 
                onClick={() => onSelect(bank)}
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
                  <div style={{ fontWeight: 600 }}>{bank.nome}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>Conta: {bank.conta_numero} | IBAN: {bank.iban}</div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <IconButton onClick={(e) => handleEdit(bank, e)} size="small" color="primary">
                    <i className="bi bi-pencil-square"></i>
                  </IconButton>
                  <IconButton onClick={(e) => handleDelete(bank.id, e)} size="small" color="error">
                    <i className="bi bi-trash"></i>
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <div style={{ padding: "20px", width: "400px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3>{editingBank ? "Editar Banco" : "Novo Banco"}</h3>
          <TextField 
            label="Nome do Banco" 
            fullWidth 
            value={formData.nome} 
            onChange={(e) => setFormData({...formData, nome: e.target.value})} 
          />
          <TextField 
            label="Número da Conta" 
            fullWidth 
            value={formData.conta_numero} 
            onChange={(e) => setFormData({...formData, conta_numero: e.target.value})} 
          />
          <TextField 
            label="IBAN" 
            fullWidth 
            value={formData.iban} 
            onChange={(e) => setFormData({...formData, iban: e.target.value})} 
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
        message="Deseja realmente excluir este banco? Esta ação não poderá ser desfeita."
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
