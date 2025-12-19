import FormDataCRF from "../../components/elements/FormCrf";
import { useNavigate } from "react-router-dom";

export default function NovaRequisicao() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/crf");
  };

  const handleSaved = () => {
    // Dados já foram recarregados pelo componente pai se necessário
  };

  return (
    <div style={{ padding: 20 }}>
      <FormDataCRF onClose={handleClose} onSaved={handleSaved} />
    </div>
  );
}

