import { useNavigate, useParams } from "react-router-dom";
import FormDataCRF from "../../components/elements/FormCrf";

export default function EditarCrf() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleClose = () => {
    navigate("/crf");
  };

  if (!id) {
    return (
      <div style={{ padding: 20 }}>
        <p>CRF não encontrada.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <FormDataCRF crfId={id} onClose={handleClose} onSaved={() => {}} />
    </div>
  );
}

