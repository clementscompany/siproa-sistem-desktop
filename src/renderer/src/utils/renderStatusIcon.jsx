export function renderIconStatus(status) {
  const icons = {
    success: <i className="bi bi-check-circle-fill" style={{ color: "green", fontSize: 20 }}></i>,
    warring: <i className="bi bi-hourglass-split" style={{ color: "#f1c40f", fontSize: 20 }}></i>,
    error: <i className="bi bi-x-circle-fill" style={{ color: "red", fontSize: 20 }}></i>,
  };

  return icons[status] || <i className="bi bi-question-circle" style={{ fontSize: 20 }}></i>;
}

export function renderStatusColor(status) {
  const colors = {
    success: "green",
    error: "red",
    warring: "#f1c40f"
  }

  return colors[status]
}