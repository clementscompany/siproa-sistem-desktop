import { useEffect, useState } from "react";
import Loader from "../../components/Alert/Loader";
import { systemApi } from "../../api/System.api";
import PassoordModal from "./PasswordModal";
import Alert from "../Alert/Alert";
import { MiniSpinner } from "../spinner/apinner";
import { useNavigate } from "react-router-dom";
export default function AdminLogin() {
  const [senha, setSenha] = useState("");
  const [isVisible, setIsVisble] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const nav = useNavigate();
  const [alert, setAlert] = useState({
    messageCancel: "Não",
    message: "",
    isOpen: false,
    status: "",
    onConfirm: () => { },
    showCancellButton: false,
    onCancell: () => { },
    title: "",
  });
  const [havePassword, setHavePassword] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingButton(true);

    if (senha.trim() === "") {
      setTimeout(() => {
        setIsLoadingButton(false);
      }, 1000)
      return;
    }

    try {
      const Api = new systemApi();
      const login = await Api.loginAdmin(senha);
      const { success, message } = login;
      if (!success) {
        setAlert((before) => ({
          ...before,
          isOpen: true,
          status: "error",
          message,
          onConfirm: closeAlert,
          title: "Erro de autenticação"
        }))
        return;
      }

      setAlert((before) => ({
        ...before,
        isOpen: true,
        status: "success",
        message: message + " . Deseja salvar os dados da sessão?",
        onConfirm: () => {
          localStorage.setItem("rememberLogin", "true");
          closeModal();
          setIsLoading(true);
          setTimeout(() => {
            nav("/home")
            setIsLoading(false)
          }, 1000)
        },
        showCancellButton: true,

        onCancell: () => {
          closeModal();
          setIsLoading(true);
          setTimeout(() => {
            nav("/home")
            setIsLoading(false)
          }, 1000)
        },
        title: "Sucesso"
      }))



    } catch (error) {
      setAlert((before) => ({
        ...before,
        isOpen: true,
        status: "error",
        message: "Houve um erro ao enviar os dados",
        onConfirm: closeAlert,
        title: "Erro inesperado!"
      }))
    } finally {
      setTimeout(() => {
        setIsLoadingButton(false)
      }, 1000)
    }
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
      setAlert({

      })
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

  const closeAlert = () => {
    setAlert({
      message: "",
      isOpen: false,
      status: "",
      onConfirm: () => { },
      showCancellButton: false,
      onCancell: () => { },
      title: "",
    })
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

      <button className="logBtn" type="submit" disabled={isLoadingButton === true} >{isLoadingButton === false ? "Entrar" : <MiniSpinner />}</button>

      <div className="forgotContainer">
        <a href="#">Esqueceu a senha?</a>
      </div>

      {isLoading === true && <Loader />}
      {havePassword === false && <PassoordModal clodePasswordModal={closeModal} />}
      {alert.isOpen === true && <Alert
        message={alert.message}
        status={alert.status}
        showCancellButton={alert.showCancellButton}
        onClose={alert.onConfirm}
        onCancell={alert.onCancell}
        title={alert.title}
        cancelMessage={alert.messageCancel}
      />}
    </form>
  )
}