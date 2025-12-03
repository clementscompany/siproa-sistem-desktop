import "./login.css"
import Loader from "../../components/Alert/Loader";
import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import UserLogin from "./UserLogin";
import image from "../../assets/img/wellcome.png";
import { useNavigate } from "react-router-dom";
export default function LoginComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    status: "",
    onClose: () => { },
    confirm: () => { },
    showCancelButton: false,
  })
  const nav = useNavigate();
  useEffect(() => {
    fetchDataLogin();
  }, [])

  async function fetchDataLogin() {
    try {
      const remember_login = localStorage.getItem("rememberLogin");
      if (!remember_login) {
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        nav("/home");
      }, 1000)

    } catch (error) {

    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }
  return (
    <div className="loginComponent">
      {isLoading === true && <Loader />}

      <div className="lefiContainer">
        <div className="center">
          <h2>
            Excelentes trabalhos estão à sua espera!
          </h2>
          <span>
            Acesse ao seu painel o melhor que o nosso produto pode oferecer
          </span>
        </div>
        <div className="image">
          <img
            width={400}
            height={400}
            src={image}
            alt="Pessoa ilustração"
          />
        </div>
      </div>

      <div className="rigthContainer">
        <div className="topConainer">
          <button title="fechar o sistema"> <i className="bi bi-power"></i> </button>
          <button title="fechar o sistema" onClick={() => setIsAdmin(before => !before)} >
            <i className="bi bi-arrow-left-right"></i>
            {!isAdmin ? "Acessar como Admin" : "Acesso normal"}
          </button>
        </div>

        {
          isAdmin ? <AdminLogin /> : <UserLogin />
        }
      </div>
    </div>
  )
}