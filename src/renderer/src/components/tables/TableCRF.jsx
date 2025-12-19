import React, { useEffect, useState } from "react";
import { CrfApi } from "../../api/Crf.api";
import "./TableCRF.css";

const crfApi = new CrfApi();

export default function TableCRF({ limit = 0, onViewDetails }) {
  const [data, setData] = useState([]);

  const handleView = (item) => {
    if (onViewDetails) onViewDetails(item);
  };

  const handleEdit = (item) => console.log("Editar:", item);
  const handleDelete = (item) => console.log("Eliminar:", item);

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
            : "Inativo"
      }));

      setData(limit ? formatted.slice(0, limit) : formatted);
    } catch (err) {
      console.error("Erro ao buscar CRFs:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  return (
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
  );
}
