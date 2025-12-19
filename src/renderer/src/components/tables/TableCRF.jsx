import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CrfApi } from "../../api/Crf.api";

const crfApi = new CrfApi();

export default function TableCRF({ limit = 0 }) {
  const handleView = (item) => console.log("Ver:", item);
  const handleEdit = (item) => console.log("Editar:", item);
  const handleDelete = (item) => console.log("Eliminar:", item);

  const [data, setData] = useState([]);

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
        data_emissao: item.data_entrada ? item.data_entrada.split('T')[0] : "N/A",
        data_validade: item.data_pagamento ? item.data_pagamento.split('T')[0] : "N/A",
        estado: item.estado_pagamento === "PAGO" ? "Pago" : (item.active ? "Ativo" : "Inativo"),
      }));
      setData(limit ? formatted.slice(0, limit) : formatted);
    } catch (error) {
      console.error("Erro ao buscar CRFs:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [limit]);

  return (
    <TableContainer
      component={Paper}
      elevation={3}

    >
      <Table>
        <TableHead>
          <TableRow style={{ background: "var(--primary)" }}>
            <TableCell sx={{ minWidth: 120 }}><strong style={{ color: "var(--color-button)" }}>Nº CRF</strong></TableCell>
            <TableCell sx={{ minWidth: 180 }}><strong style={{ color: "var(--color-button)" }}>Empresa</strong></TableCell>
            <TableCell sx={{ minWidth: 140 }}><strong style={{ color: "var(--color-button)" }}>NIF</strong></TableCell>
            <TableCell sx={{ minWidth: 130 }}><strong style={{ color: "var(--color-button)" }}>Tipo</strong></TableCell>
            <TableCell sx={{ minWidth: 200 }}><strong style={{ color: "var(--color-button)" }}>Endereço</strong></TableCell>
            <TableCell sx={{ minWidth: 150 }}><strong style={{ color: "var(--color-button)" }}>Telefone</strong></TableCell>
            <TableCell sx={{ minWidth: 120 }}><strong style={{ color: "var(--color-button)" }}>Estado</strong></TableCell>
            <TableCell sx={{ minWidth: 150 }} align="center"><strong style={{ color: "var(--color-button)" }} >Ações</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                backgroundColor:
                  item.estado === "Inativo"
                    ? "#ffe5e5"
                    : item.estado === "Ativo"
                      ? "#e8ffe8"
                      : "transparent",
              }}
            >
              <TableCell>{item.numero_crf}</TableCell>
              <TableCell>{item.empresa}</TableCell>
              <TableCell>{item.nif}</TableCell>
              <TableCell>{item.tipo_operador}</TableCell>
              <TableCell>{item.endereco}</TableCell>
              <TableCell>{item.telefone}</TableCell>
              <TableCell><strong>{item.estado}</strong></TableCell>

              <TableCell align="center">
                <Tooltip title="Ver detalhes">
                  <IconButton color="primary" onClick={() => handleView(item)}>
                    <i className="bi bi-eye" style={{ fontSize: 18 }}></i>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Editar">
                  <IconButton color="warning" onClick={() => handleEdit(item)}>
                    <i className="bi bi-pencil-square" style={{ fontSize: 18 }}></i>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar">
                  <IconButton color="error" onClick={() => handleDelete(item)}>
                    <i className="bi bi-trash" style={{ fontSize: 18 }}></i>
                  </IconButton>
                </Tooltip>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );

}
