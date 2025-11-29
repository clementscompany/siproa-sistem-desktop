import { systemApi } from "../../api/System.api";
import Alert from "../../components/Alert/Alert";
import Loader from "../../components/Alert/Loader";
import Settings from "../../components/Settings/Settings";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const APi = new systemApi();
  const [isConfigure, setIsConfigured] = useState(false);
  const [isError, setIsError] = useState({ open: false, message: "", status: "", title: "" });
  const [isLoading, setIsLoading] = useState(true);

  const nav = useNavigate();
  useEffect(() => {
    getConfigApp();
  })

  async function getConfigApp() {
    try {
      const data = await APi.getConfigApp();
      const { success, result } = data;

      if (!success) {
        return;
      }

      nav("/")

    } catch (error) {
      setIsLoading(false);
      setIsError({
        message: "Erro ao obter os dados do sistema",
        status: "error",
        open: true,
        title: "Erro inesperado"
      })
    }
    finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }

  const hendleCloseError = () => {
    setIsError({ open: false, message: "", status: "" })
  }
  return (
    <React.Fragment>
      {isLoading === true && <Loader />}
      {isError.open === true && <Alert message={isError.message} status={isError.status} onClose={hendleCloseError} title={isError.title} />}
      <Settings />
    </React.Fragment>
  )
}