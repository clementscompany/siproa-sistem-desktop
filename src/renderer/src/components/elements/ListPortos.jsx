import { Dialog, Button } from "@mui/material";
import { useState, useMemo } from "react";
import { PORTOS_DATA } from "../../constants/portos.data";

export default function ListPortos({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPorts = useMemo(() => {
    if (!searchTerm) return PORTOS_DATA.slice(0, 100); // Show initial list of 100 items for UX

    const search = searchTerm.toLowerCase();
    const results = [];
    for (let i = 0; i < PORTOS_DATA.length; i++) {
      const port = PORTOS_DATA[i];
      if (
        port.CITY.toLowerCase().includes(search) ||
        port.COUNTRY.toLowerCase().includes(search) ||
        (port.STATE && port.STATE.toLowerCase().includes(search))
      ) {
        results.push(port);
        if (results.length >= 100) break; // Limit to 100 results for performance
      }
    }
    return results;
  }, [searchTerm]);

  return (
    <Dialog open={isOpen} fullWidth maxWidth="sm">
      <div style={{ padding: "20px", minHeight: 500, maxHeight: 500 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", margin: 0 }}>Selecionar Porto</h2>
          <Button variant="outlined" color="error" onClick={onClose}>Fechar</Button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f5f5f5", padding: "10px", borderRadius: "8px", marginBottom: "15px" }}>
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Pesquisar por Cidade, País ou Estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontSize: "14px" }}
            autoFocus
          />
        </div>

        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {filteredPorts.length > 0 ? (
            filteredPorts.map((port, index) => (
              <div
                key={`${port.CITY}-${port.COUNTRY}-${index}`}
                onClick={() => onSelect(port)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{port.CITY}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {port.STATE ? `${port.STATE}, ` : ""}{port.COUNTRY}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#999", textAlign: "right" }}>
                  Lat: {port.LATITUDE}<br />
                  Long: {port.LONGITUDE}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
              Nenhum porto encontrado para sua pesquisa.
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
