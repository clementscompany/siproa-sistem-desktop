import Avatar from "../../components/elements/Avatar";
import Analitics from "./Analiics";
import "./home.css";
export default function HomePage() {
  return (
    <div className="homeComponent">
      <div className="headerHome">
        <h1>Dashboard</h1>
        <div className="inputBox">
          <input type="search" placeholder="Pesquisar.." />
          <i className="bi bi-search"></i>
        </div>
        <Avatar />
      </div>
      <div style={{ margin: 12, color: "var(--text2)", gap: 12, display:"flex", alignItems:"center" }}>
        <small> Data:
          {" "}{new Date().toLocaleDateString('pt-AO')}
        </small>
        <h4>Visão geral</h4>
      </div>

      <div className="">
        <Analitics />
      </div>
    </div>
  )
}