import "./styles.css";
import image from "../../assets/img/wellcome.png";
import { useNavigate } from "react-router-dom";
export default function Welcome() {
  const navigate = useNavigate();
  const hanlerStart = () => {
    navigate("/settings");
  }
  return (
    <div className="welcomeComponent">
      <button className="settingsBtn">
        <i className="bi bi-gear"></i>
      </button>

      <div className="welcomeCard card">

        {/* LADO ESQUERDO */}
        <div className="leftContent">
          <h1>Bem-vindo ao Sistema Aduaneiro</h1>
          <p className="subtitle">
            Organize, acompanhe e controle todas as operações de forma simples e eficiente.
          </p>

          <button className="btn-primary" style={{ marginTop: "20px" }} onClick={hanlerStart}>
            Entrar no sistema
          </button>
        </div>

        {/* LADO DIREITO */}
        <div className="rightContent">
          <div className="purpleBox">
            <h2>Gestão Aduaneira moderna,</h2>
            <h2>rápida e confiável.</h2>

            <p className="miniLine"></p>

            {/* Imagem ilustrativa */}
            <div className="imageBox">
              {/* Coloque a sua imagem aqui */}
              <img
                src={image}
                alt="Pessoa ilustração"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
