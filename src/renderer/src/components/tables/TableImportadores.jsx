import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from "@mui/material";
import { ImportadoresApi } from "../../api/Importadores.api";
import Alert from "../Alert/Alert";

const api = new ImportadoresApi();

export default function TableImportadores({ onEdit }) {
  const [data, setData] = useState([]);
  const [alertState, setAlertState] = useState({ open: false, message: "", status: "", title: "" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, item: null });

  const fetchData = async () => {
    try {
      const rows = await api.getAll();
      setData(rows);
    } catch (error) {
      setAlertState({ open: true, status: "error", title: "Erro", message: "Falha ao carregar clientes" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (item) => {
    setConfirmDelete({ open: true, item });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.item) return;

    try {
      await api.delete(confirmDelete.item.id);
      setAlertState({ open: true, status: "success", title: "Sucesso", message: "Cliente eliminado com sucesso" });
      setConfirmDelete({ open: false, item: null });
      fetchData();
    } catch (error) {
      setAlertState({ open: true, status: "error", title: "Erro", message: "Falha ao eliminar cliente" });
      setConfirmDelete({ open: false, item: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ open: false, item: null });
  };

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: "var(--primary)" }}>
              <TableCell sx={{ minWidth: 100, fontWeight: 600, color: "#fff", fontSize: "14px" }}>Código</TableCell>
              <TableCell sx={{ minWidth: 200, fontWeight: 600, color: "#fff", fontSize: "14px" }}>Nome</TableCell>
              <TableCell sx={{ minWidth: 130, fontWeight: 600, color: "#fff", fontSize: "14px" }}>NIF</TableCell>
              <TableCell sx={{ minWidth: 220, fontWeight: 600, color: "#fff", fontSize: "14px" }}>Morada</TableCell>
              <TableCell sx={{ minWidth: 130, fontWeight: 600, color: "#fff", fontSize: "14px" }}>Telefone</TableCell>
              <TableCell sx={{ minWidth: 200, fontWeight: 600, color: "#fff", fontSize: "14px" }}>Email</TableCell>
              <TableCell sx={{ minWidth: 100, fontWeight: 600, color: "#fff", fontSize: "14px" }} align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ padding: "40px", color: "#999", fontSize: "14px" }}>
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#f9f9f9"
                    },
                    "&:hover": {
                      backgroundColor: "#f0f7ff"
                    }
                  }}
                >
                  <TableCell sx={{ fontSize: "13px", padding: "12px 16px" }}>{item.codigo || "-"}</TableCell>
                  <TableCell sx={{ fontSize: "13px", padding: "12px 16px", fontWeight: 500 }}>{item.nome}</TableCell>
                  <TableCell sx={{ fontSize: "13px", padding: "12px 16px" }}>{item.nif || "-"}</TableCell>
                  <TableCell sx={{ fontSize: "13px", padding: "12px 16px" }}>{item.morada || "-"}</TableCell>
                  <TableCell sx={{ fontSize: "13px", padding: "12px 16px" }}>{item.telefone || "-"}</TableCell>
                  <TableCell sx={{ fontSize: "13px", padding: "12px 16px" }}>{item.email || "-"}</TableCell>
                  <TableCell align="center" sx={{ padding: "12px 16px" }}>
                    <Tooltip title="Ver detalhes">
                      <IconButton
                        color="primary"
                        onClick={() => { }}
                        sx={{ padding: "6px", margin: "0 2px" }}
                      >
                        <i className="bi bi-eye" style={{ fontSize: 16 }}></i>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        color="warning"
                        onClick={() => onEdit?.(item)}
                        sx={{ padding: "6px", margin: "0 2px" }}
                      >
                        <i className="bi bi-pencil-square" style={{ fontSize: 16 }}></i>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(item)}
                        sx={{ padding: "6px", margin: "0 2px" }}
                      >
                        <i className="bi bi-trash" style={{ fontSize: 16 }}></i>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
          message={`Tem certeza que deseja eliminar o cliente "${confirmDelete.item.nome}"?`}
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

