import { renderIconStatus, renderStatusColor } from "../../utils/renderStatusIcon";
import "./style.css";

export default function Alert({
  title,
  message,
  showCancellButton = false,
  status,
  onClose,
  onCancell,
  cancelMessage
}) {
  return (
    <div className="alertModal">
      <div className="modalContent">
        <div className="modalHeader">
          <span style={{ color: renderStatusColor(status) }}>
            {title ?? "Atenção"}
          </span>
          {renderIconStatus(status ?? "success")}
        </div>

        <div className="data">
          {message ?? "Message"}
        </div>

        <div className="modalFooter">
          {showCancellButton && (
            <button className="cancelButton" onClick={onCancell}>
              {cancelMessage ?? "cancelar"}
            </button>
          )}

          <button className="closeButton" onClick={onClose}>ok</button>
        </div>
      </div>
    </div>
  );
}
