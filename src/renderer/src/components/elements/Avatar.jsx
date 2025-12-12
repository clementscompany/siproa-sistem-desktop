import { useEffect, useState } from "react"
import "./style.css"
import { systemApi } from "../../api/System.api"
export default function Avatar() {
  const [user, setUser] = useState({})
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
      alert("Erro ao processar os dados do sistema!")
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
    </div>
  )
}