import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Backup.css";
import { appEnv } from "../../env/appEnv";
import { MiniSpinner } from "../../components/spinner/apinner";

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* =========================
     EXPORT
  ========================= */
  const getBackup = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${appEnv.server}/backup/export`);

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.json";
      a.click();

      window.URL.revokeObjectURL(url);

      showToast("success", "Backup exportado com sucesso");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     IMPORT
  ========================= */
  const importBackup = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget);
      const file = formData.get("backup");

      if (!file) {
        throw new Error("Selecione um ficheiro de backup");
      }

      const response = await fetch(`${appEnv.server}/backup/import`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Erro ao importar backup");
      }

      showToast("success", "Backup restaurado com sucesso");

      setTimeout(() => {
        navigate(-1);
      }, 800);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backupPage">

      {/* HEADER DESKTOP */}
      <div className="backupHeader">
        <div>
          <h1>Backup do Sistema</h1>
          <p>Importação e exportação de dados do sistema</p>
        </div>

        <button onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>

      {/* CENTER CONTENT */}
      <div className="backupContentWrapper">

        <div className="backupGrid">

          {/* EXPORT */}
          <div className="backupCard">
            <h2>Exportar Dados</h2>
            <p>Gera um ficheiro completo do sistema.</p>

            <button onClick={getBackup} disabled={isLoading}>
              Exportar Backup
            </button>
          </div>

          {/* IMPORT */}
          <form className="backupCard" onSubmit={importBackup}>
            <h2>Importar Dados</h2>
            <p>Restaurar backup existente.</p>

            <input type="file" name="backup" accept=".json" />

            <button type="submit" disabled={isLoading}>
              Importar Backup
            </button>
          </form>

        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="alertModal">
          <MiniSpinner />
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}