import React, { useEffect, useState } from "react";
import { CrfApi } from "../../api/Crf.api";
import { useNavigate } from "react-router-dom";
import Alert from "../Alert/Alert";
import "./TableCRF.css";

const crfApi = new CrfApi();

export default function TableCRF({ limit = 0, onViewDetails, reload }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    status: "",
    title: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, item: null });

  const handleView = (item) => {
    if (onViewDetails) onViewDetails(item);
  };

  const handleEdit = (item) => navigate(`/crf/${item.id}/editar`);
  const handleDelete = (item) => setConfirmDelete({ open: true, item });

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, item: null });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.item) return;

    try {
      await crfApi.delete(confirmDelete.item.id);
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "CRF eliminada com sucesso",
      });
      setConfirmDelete({ open: false, item: null });
      fetchData();
    } catch (error) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: "Falha ao eliminar CRF",
      });
      setConfirmDelete({ open: false, item: null });
    }
  };

  const fetchData = async () => {
    try {
      const result = await crfApi.getAll();

      const formatted = result.map(item => ({
        id: item.id,
        numero_crf: item.numero_crf,
        empresa: item.cliente_nome || "N/A",
        nif: item.cliente_nif || "N/A",
        tipo_operador: "Importador",
        endereco: item.cliente_endereco || "N/A",
        telefone: item.cliente_telefone || "N/A",
        estado:
          item.estado_pagamento === "PAGO"
            ? "Pago"
            : item.active
              ? "Ativo"
              : "Inativo",
        numero_factura: item.crf_ou_f || "N/A",
      }));
      setData(limit ? formatted.slice(0, limit) : formatted);
    } catch (err) {
      console.error("Erro ao buscar CRFs:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit, reload]);

  return (
    <>
      <div className="table-wrapper card">
        <table className="table-crf">
          <thead>
            <tr>
              <th>Nº CRF</th>
              <th>Empresa</th>
              <th>NIF</th>
              <th>Tipo</th>
              <th>Endereço</th>
              <th>Telefone</th>
              <th>Estado</th>
              <th className="actions">Ações</th>
            </tr>
          </thead>

          <tbody>
            {data.map(item => (
              <tr key={item.id} data-state={item.estado}>
                <td>{item.numero_crf?.slice(0, 6)}...</td>
                <td className="truncate">{item.empresa}</td>
                <td>{item.nif}</td>
                <td>{item.tipo_operador}</td>
                <td className="truncate">{item.endereco}</td>
                <td>{item.telefone}</td>
                <td>
                  <span className={`status ${item.estado.toLowerCase()}`}>
                    {item.estado}
                  </span>
                </td>
                <td className="actions">
                  <button title="Ver" onClick={() => handleView(item)}>
                    <i className="bi bi-eye" />
                  </button>
                  <button title="Editar" onClick={() => handleEdit(item)}>
                    <i className="bi bi-pencil-square" />
                  </button>
                  <button title="Eliminar" onClick={() => handleDelete(item)}>
                    <i className="bi bi-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {alertState.open === true && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={() => setAlertState((p) => ({ ...p, open: false }))}
        />
      )}

      {confirmDelete.open && confirmDelete.item && (
        <Alert
          message={`Tem certeza que deseja eliminar a CRF "${confirmDelete.item.numero_crf}"?`}
          status="warring"
          title="Confirmar Eliminação"
          showCancellButton={true}
          cancelMessage="Cancelar"
          confirmMessage="Eliminar"
          onClose={handleConfirmDelete}
          onCancell={handleCancelDelete}
        />
      )}
    </>
  );
}
