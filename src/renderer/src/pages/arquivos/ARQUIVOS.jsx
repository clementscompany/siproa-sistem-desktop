import { useState } from "react";
import Avatar from "../../components/elements/Avatar";
import ModalSettings from "../../components/elements/ModalSettings";
import TableArquivos from "../../components/tables/TableArquivos";
import FormArquivoDialog from "./FormArquivo";
import ArquivoDetailsView from "./ArquivoDetailsView";

export default function ARQUIVOS() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [reload, setReload] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [viewId, setViewId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSaved = () => {
    setRefreshFlag((v) => v + 1);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ color: "var(--primary)" }}>Gestão de Arquivos</h2>
        <Avatar onClickSettings={() => setShowSettings(true)} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="inputBox" style={{ flex: 1 }}>
          <input type="search" placeholder="Pesquisar..." />
          <i className="bi bi-search"></i>

          <button title="Adicionar" style={{ backgroundColor: "var(--primary)" }} onClick={() => setIsOpenDialog(true)}>
            <i className="bi bi-plus" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>

          <button title="Recarregar" style={{ backgroundColor: "var(--primary)" }} onClick={() => setReload((before) => !before)}>
            <i className="bi bi-arrow-clockwise" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 44, maxHeight: "calc(100% - 100px)", overflowY: "auto" }}>
        <TableArquivos
          key={refreshFlag}
          reload={reload}
          onViewDetails={(item) => setViewId(item.id)}
          onEdit={(item) => {
            setEditId(item.id);
            setIsOpenDialog(true);
          }}
        />
      </div>

      <FormArquivoDialog
        isOpen={isOpenDialog}
        onClose={() => {
          setIsOpenDialog(false);
          setEditId(null);
        }}
        onSaved={handleSaved}
        arquivoId={editId}
      />

      <ArquivoDetailsView open={!!viewId} arquivoId={viewId} onClose={() => setViewId(null)} />

      <ModalSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
