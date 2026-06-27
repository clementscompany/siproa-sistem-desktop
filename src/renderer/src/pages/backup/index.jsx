import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Backup.css";
import { appEnv } from "../../env/appEnv";
import { MiniSpinner } from "../../components/spinner/apinner";

export default function BackupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getBackup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${appEnv.server}/backup/export`);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao exportar backup");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "backup.json";

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     IMPORT BACKUP
  ========================= */
  const importBackup = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const formData = new FormData(e.currentTarget); // 🔥 FIX PRINCIPAL
      const file = formData.get("backup");

      if (!file || file.size === 0) {
        throw new Error("Selecione um arquivo válido");
      }

      const response = await fetch(`${appEnv.server}/backup/import`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Erro ao importar backup");
      }

      if (!data?.success) {
        throw new Error(data?.message || "Erro ao importar backup");
      }

      navigate(-1);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backupPage">
      <div className="backupHeader">
        <button onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Voltar
        </button>

        <div>
          <h1>Backup do Sistema</h1>
          <p>Importe ou exporte todos os dados do sistema.</p>
        </div>
      </div>

      <div className="backupGrid">
        {/* EXPORT */}
        <div className="card backupCard">
          <h2>Exportar Dados</h2>
          <button
            onClick={getBackup}
            disabled={isLoading}
            className="btn-primary"
          >
            Exportar Backup
          </button>
        </div>

        {/* IMPORT */}
        <form className="card backupCard" onSubmit={importBackup}>
          <h2>Importar Dados</h2>

          <input type="file" name="backup" accept=".json" />

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            Importar Backup
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="alertModal">
          <MiniSpinner />
        </div>
      )}
    </div>
  );
}