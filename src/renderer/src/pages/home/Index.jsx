import Avatar from "../../components/elements/Avatar";
import ModalSettings from "../../components/elements/ModalSettings";
import TableCRF from "../../components/tables/TableCRF";
import Analitics from "./Analiics";
import "./home.css";
import { useState } from "react";

export default function HomePage() {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="homeComponent">
      <div className="headerHome">
        <h1>Dashboard</h1>
        <div className="inputBox">
          <input type="search" placeholder="Pesquisar.." />
          <i className="bi bi-search"></i>
        </div>
        <Avatar onClickSettings={() => setShowSettings(true)} />
      </div>
      <div style={{ margin: 12, color: "var(--text2)", gap: 12, display: "flex", alignItems: "center" }}>
        <small> Data:
          {" "}{new Date().toLocaleDateString('pt-AO')}
        </small>
        <h4>Visão geral</h4>
      </div>

      <div className="">
        <Analitics />
      </div>

      <div style={{ padding: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <small style={{ color: "var(--text2)", fontWeight: "700" }}>Tabela de requisição de fundos</small>
        </div>
        <TableCRF limit={8} />
      </div>

      <ModalSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}