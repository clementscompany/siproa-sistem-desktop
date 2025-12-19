import { useState } from "react";
import Avatar from "../../components/elements/Avatar";
import TableClients from "../../components/tables/TableClients";
import FormClientDialog from "./FormClient";

export default function ClientsPage() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ color: "var(--primary)" }}>Gestão de Clientes</h2>
        <Avatar />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="inputBox" style={{ flex: 1 }}>
          <input type="search" placeholder="Pesquisar..." />
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
        <TableClients key={refreshFlag} />
      </div>

      <FormClientDialog
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        onSaved={() => setRefreshFlag((v) => v + 1)}
      />
    </div>
  );
}
