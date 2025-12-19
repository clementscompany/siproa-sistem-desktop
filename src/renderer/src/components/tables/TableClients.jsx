import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import { ImportadoresApi } from "../../api/Importadores.api";
import Alert from "../Alert/Alert";

const api = new ImportadoresApi();

export default function TableClients() {
  const [data, setData] = useState([]);
  const [alertState, setAlertState] = useState({ open: false, message: "", status: "", title: "" });

  const fetchData = async () => {
    try {
      const rows = await api.getClients();
      setData(rows);
    } catch (error) {
      setAlertState({ open: true, status: "error", title: "Erro", message: "Falha ao carregar clientes" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (item) => {
    try {
      await api.deleteClient(item.id);
      setAlertState({ open: true, status: "success", title: "Sucesso", message: "Cliente eliminado" });
      fetchData();
    } catch (error) {
      setAlertState({ open: true, status: "error", title: "Erro", message: "Falha ao eliminar cliente" });
    }
  };

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow style={{ background: "var(--primary)" }}>
            <TableCell sx={{ minWidth: 180 }}><strong style={{ color: "var(--color-button)" }}>Nome</strong></TableCell>
            <TableCell sx={{ minWidth: 140 }}><strong style={{ color: "var(--color-button)" }}>NIF</strong></TableCell>
            <TableCell sx={{ minWidth: 200 }}><strong style={{ color: "var(--color-button)" }}>Morada</strong></TableCell>
            <TableCell sx={{ minWidth: 120 }}><strong style={{ color: "var(--color-button)" }}>Telefone</strong></TableCell>
            <TableCell sx={{ minWidth: 200 }}><strong style={{ color: "var(--color-button)" }}>Email</strong></TableCell>
            <TableCell sx={{ minWidth: 120 }} align="center"><strong style={{ color: "var(--color-button)" }}>Ações</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.nif}</TableCell>
              <TableCell>{item.morada}</TableCell>
              <TableCell>{item.telefone}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell align="center">
                <Tooltip title="Ver detalhes">
                  <IconButton color="primary" onClick={() => { }}>
                    <i className="bi bi-eye" style={{ fontSize: 18 }}></i>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar">
                  <IconButton color="warning" onClick={() => { }}>
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
      {alertState.open === true && (
        <Alert
          message={alertState.message}
          status={alertState.status}
          title={alertState.title}
          onClose={() => setAlertState((p) => ({ ...p, open: false }))}
        />
      )}
    </TableContainer>
  );
}
