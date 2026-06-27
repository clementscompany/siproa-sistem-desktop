import { useEffect, useState } from "react";
import { ProcessosApi } from "../../api/Processos.api";
import Alert from "../Alert/Alert";
import "./TableProcessos.css";

const api = new ProcessosApi();

export default function TableProcessos({ onViewDetails, onEdit, reload }) {
  const [data, setData] = useState([]);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    status: "",
    title: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, item: null });

  const fetchData = async () => {
    try {
      const result = await api.getAll();
      setData(result);
    } catch (err) {
      console.error("Erro ao buscar Processos:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  const handleView = (item) => onViewDetails?.(item);
  const handleEdit = (item) => onEdit?.(item);
  const handleDelete = (item) => setConfirmDelete({ open: true, item });

  const handleCancelDelete = () => setConfirmDelete({ open: false, item: null });

  const handleConfirmDelete = async () => {
    if (!confirmDelete.item) return;
    try {
      await api.delete(confirmDelete.item.id);
      setAlertState({
        open: true,
        status: "success",
        title: "Sucesso",
        message: "Processo eliminado com sucesso",
      });
      setConfirmDelete({ open: false, item: null });
      fetchData();
    } catch (error) {
      setAlertState({
        open: true,
        status: "error",
        title: "Erro",
        message: "Falha ao eliminar Processo",
      });
      setConfirmDelete({ open: false, item: null });
    }
  };

  return (
    <>
      <div className="table-wrapper card">
        <table className="table-processos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Doc. Transporte</th>
              <th>Cliente</th>
              <th>Status</th>
              <th>Abertura</th>
              <th>Total</th>
              <th className="actions">Ações</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td className="truncate">{item.doc_transporte || "—"}</td>
                <td className="truncate">{item.cliente_nome || "—"}</td>
                {
                  console.log(item)
                }
                <td>
                  <span className={`status ${(item.status || "aberta").toLowerCase()}`}>
                    {item.status || "aberta"}
                  </span>
                </td>
                <td>{item.data_abertura || "—"}</td>
                <td>{item.total?.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) || "—"}</td>
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
          message={`Tem certeza que deseja eliminar o Processo "${confirmDelete.item.id}"?`}
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
