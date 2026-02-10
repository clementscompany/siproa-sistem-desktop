import { useState } from "react";
import Avatar from "../../components/elements/Avatar";
import TableCRF from "../../components/tables/TableCRF";
import FormCRF from "./FormCrf";
import CrfSheetView from "./CrfSheetView";
import ModalSettings from "../../components/elements/ModalSettings";

export default function CRF() {
  const [isOpenDialog, setIsOpenDialod] = useState(false);
  const [reload, setReload] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [viewId, setViewId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSaved = () => {
    setRefreshFlag((v) => v + 1);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ color: "var(--primary)" }}>Gestão de CRF</h2>
        <Avatar onClickSettings={() => setShowSettings(true)} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="inputBox" style={{ flex: 1 }}>
          <input type="search" placeholder="Pesquisar..." />
          <i className="bi bi-search"></i>
          <button title="Exportar PDF" style={{ backgroundColor: "var(--primary)" }}>
            <i className="bi bi-filetype-pdf" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>
          <button title="Exportar Excel" style={{ backgroundColor: "green" }}>
            <i className="bi bi-filetype-xls" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>

          <button title="Adicionar" style={{ backgroundColor: "var(--primary)" }} onClick={() => setIsOpenDialod(true)}>
            <i className="bi bi-plus" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>

          <button title="Recarregar" style={{ backgroundColor: "var(--primary)" }} onClick={() => setReload((before) => !before)}>
            <i className="bi bi-arrow-clockwise" style={{ border: "none", color: "var(--color-button)" }}></i>
          </button>
        </div>
      </div>


      {/* <!-- Lista  --> */}
      <div style={{ marginTop: 44, maxHeight: "calc(100% - 100px)", overflowY: "auto" }}>
        <TableCRF key={refreshFlag} onViewDetails={(item) => setViewId(item.id)} reload={reload} />
      </div>

      <FormCRF
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialod(false)}
        onSaved={handleSaved}
      />
      <CrfSheetView open={!!viewId} crfId={viewId} onClose={() => setViewId(null)} />
      <ModalSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
