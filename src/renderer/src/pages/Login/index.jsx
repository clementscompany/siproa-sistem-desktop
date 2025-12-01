
import "./Login.css"
import Welcome from "../../components/wellcome/wellcome";
import { useEffect, useState } from "react";
import { systemApi } from "../../api/System.api";
import Alert from "../../components/Alert/Alert";
import Loading from "../../components/Alert/Loader"
import LoginComponent from "../../components/Login/Login";
export default function WellCome() {


  const [alert, setAlert] = useState({ message: "", status: "", onclose: () => { }, onCancell: () => { }, isOpen: false });
  const [issetConfig, setIssetConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchData()
  })

  async function fetchData() {
    try {
      const Api = new systemApi();

      const getData = await Api.getConfigApp();
      const { success } = getData;
      if (!success) {
        return;
      }

      setIssetConfig(true);

    } catch (error) {
      setAlert({
        message: "Erro ao obter os dados do sistema",
        status: "error",
        onclose: () => { closeModal }
      })
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }

  const closeModal = () => {
    setAlert({ message: "", status: "", onclose: () => { }, onCancell: () => { }, isOpen: false });
  }
  return (
    <div className="loginContainer">
      {isLoading === true && <Loading />}

      {issetConfig === false ? <Welcome /> :
        <LoginComponent />
      }


      {alert.isOpen === true && <Alert
        message={alert.message}
        status={alert.status}
        onClose={alert.onclose}
      />}
    </div>
  )
}