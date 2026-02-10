import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Avatar from "../../components/elements/Avatar";
import TableClientes from "../../components/tables/TableImportadores";
import FormClienteDialog from "./FormImportador";

export default function ClientesPage() {
  const location = useLocation();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [editingCliente, setEditingCliente] = useState(null);

  // Abrir formulário automaticamente se estiver na rota de cadastrar
  useEffect(() => {
    if (location.pathname === "/importadores/cadastrar" || location.pathname === "/clientes/cadastrar") {
      setIsOpenDialog(true);
      setEditingCliente(null);
    }
  }, [location.pathname]);

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setIsOpenDialog(true);
  };

  const handleClose = () => {
    setIsOpenDialog(false);
    setEditingCliente(null);
  };

  const handleSaved = () => {
    setRefreshFlag((v) => v + 1);
    handleClose();
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ color: "var(--primary)" }}>Gestão de Clientes</h2>
        <Avatar />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="inputBox" style={{ flex: 1 }}>
          <input type="search" placeholder="Pesquisar cliente..." />
          <i className="bi bi-search"></i>
          <button style={{ backgroundColor: "var(--primary)" }}>
            <i className="bi bi-filetype-pdf" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>
          <button style={{ backgroundColor: "green" }}>
            <i className="bi bi-filetype-xls" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>

          <button style={{ backgroundColor: "var(--primary)" }} onClick={() => setIsOpenDialog(true)}>
            <i className="bi bi-plus" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 44, maxHeight: "calc(100% - 100px)", overflowY: "auto" }}>
        <TableClientes key={refreshFlag} onEdit={handleEdit} />
      </div>

      <FormClienteDialog
        isOpen={isOpenDialog}
        onClose={handleClose}
        onSaved={handleSaved}
        cliente={editingCliente}
      />
    </div>
  );
}

