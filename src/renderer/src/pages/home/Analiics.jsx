import React, { useEffect, useState } from "react";
import { FaUsers, FaTruck, FaBuilding, FaRegMoneyBillAlt } from "react-icons/fa";
import "./home.css";
import { systemApi } from "../../api/System.api";
import Alert from "../../components/Alert/Alert";

export default function Analitics() {
  const api = new systemApi();
  const [data, setData] = useState([]);
  const [errorAlert, setErrorAlert] = useState({ open: false, message: "", status: "error", title: "Erro" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await api.getDashboardStats();
      console.log(result);

      setData([
        {
          title: "Faturamento Total",
          icon: <FaRegMoneyBillAlt color="#6D28D9" />, // roxo
          color: "#6D28D9",
          value: result?.data?.faturamentoTotal ?? 0,
          progress: result?.data?.faturamentoTotal ?? 0
        },
        {
          title: "Total Contas",
          icon: <FaUsers color="#2563EB" />, // azul
          color: "#2563EB",
          value: result?.data?.totalContas ?? 0,
          progress: result?.data?.totalContas ?? 0
        },
        {
          title: "Total Exportadores",
          icon: <FaBuilding color="#F59E0B" />, // laranja
          color: "#F59E0B",
          value: result?.data?.totalExportadores ?? 0,
          progress: result?.data?.totalExportadores ?? 0
        },
        {
          title: "Total Importadores",
          icon: <FaBuilding color="#10B981" />, // verde
          color: "#10B981",
          value: result?.data?.totalImportadores ?? 0,
          progress: result?.data?.totalImportadores ?? 0
        },
        {
          title: "Total Transportes",
          icon: <FaTruck color="#EF4444" />, // vermelho
          color: "#EF4444",
          value: result?.data?.totalTransportes ?? 0,
          progress: result?.data?.totalTransportes ?? 0
        }
      ]);



    } catch (error) {
      setErrorAlert({ open: true, message: "Erro ao processar os dados do sistema", status: "error", title: "Erro inesperado" });
    }
  };

  return (
    <div className="analitics-container">
      {data?.map((card, index) => (
        <div className="card" key={index}>
          <div className="card-top">
            <div className="icon-box" style={{ backgroundColor: card.color + "22" }}>
              {card.icon}
            </div>
            <span className="card-title">{card.title}</span>
          </div>

          <div className="card-value">
            {card.value}
          </div>

          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${card.progress}%`, backgroundColor: card.color }}
            ></div>
          </div>
        </div>
      ))}
      {errorAlert.open === true && (
        <Alert
          message={errorAlert.message}
          status={errorAlert.status}
          title={errorAlert.title}
          onClose={() => setErrorAlert(prev => ({ ...prev, open: false }))}
        />
      )}
    </div>
  );
}
