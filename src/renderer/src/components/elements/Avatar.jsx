import { useEffect, useState } from "react"
import "./style.css"
import { systemApi } from "../../api/System.api"
import Alert from "../Alert/Alert"
export default function Avatar() {
  const [user, setUser] = useState({})
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "", status: "error", title: "Erro" })
  useEffect(() => {
    fetchProfileData()
  }, [])
  const Api = new systemApi();
  const fetchProfileData = async () => {
    try {
      const userData = await Api.getConfigApp();
      const { result } = userData
      setUser(result[0])
    } catch (error) {
      setErrorAlert({ open: true, message: "Erro ao processar os dados do sistema!", status: "error", title: "Erro inesperado" })
    }
  }
  return (
    <div className="avatarContainer">
      <i className="bi bi-person-circle"></i>
      <div className="data">
        <h4>Olá, {user?.admin_usuario ?? "Carregando..."}</h4>
        <small>Admin</small>
      </div>
      <button className="profileButton"><i className="bi bi-gear"></i></button>
      {errorAlert.open === true && (
        <Alert message={errorAlert.message} status={errorAlert.status} title={errorAlert.title} onClose={() => setErrorAlert(prev => ({ ...prev, open: false }))} />
      )}
    </div>
  )
}
