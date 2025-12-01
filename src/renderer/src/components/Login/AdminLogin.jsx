import { useEffect, useState } from "react";
import Loader from "../../components/Alert/Loader";
import { systemApi } from "../../api/System.api";
import PassoordModal from "./PasswordModal";
export default function AdminLogin() {
  const [senha, setSenha] = useState("");
  const [isVisible, setIsVisble] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [havePassword, setHavePassword] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleSetSenha = (e) => {
    const { value } = e.target;
    setSenha(value);
  }

  useEffect(() => {
    getPassword()
  }, [])

  async function getPassword(params) {
    try {
      const Api = new systemApi();
      const senha = await Api.getPasswordAdmin();
      const { password } = senha;
      if (password === null) {
        setTimeout(() => {
          setHavePassword(false);
        }, 1000)
        return;
      }

      setTimeout(() => {
        setHavePassword(true);
      }, 1000)

    } catch (error) {
      alert("Erro ao processar os dados do sistema");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }

  const closeModal = () => {
    setHavePassword(true);
    setTimeout(() => {
      getPassword();
    }, 3000)
  }


  return (
    <form className="formContainer" onSubmit={handleSubmit}>
      <div className="topform">
        <h2>Login</h2>
        <small>Coloque a senha Admin para acessar ao sistema</small>
      </div>


      <div className="inputBox">
        <i className="bi bi-person-fill-lock"></i>
        <input placeholder="Coloque a sua senha..."
          name="senha"
          value={senha}
          onChange={handleSetSenha}
          type={isVisible === false ? "password" : "text"}
        />
        {isVisible === false ?
          <i className="bi bi-eye" onClick={() => setIsVisble(true)}></i> :
          <i className="bi bi-eye-slash" onClick={() => setIsVisble(false)}></i>
        }
      </div>

      <button className="logBtn" type="submit">Entrar</button>

      <div className="forgotContainer">
        <a href="#">Esqueceu a senha?</a>
      </div>

      {isLoading === true && <Loader />}
      {havePassword === false && <PassoordModal clodePasswordModal={closeModal} />}
    </form>
  )
}