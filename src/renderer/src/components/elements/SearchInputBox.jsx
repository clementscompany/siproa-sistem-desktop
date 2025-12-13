import { Dialog } from "@mui/material";
import "./style.css";
export default function SearchBoxForm({ isOpen }) {

  const data = [
    { nome: "Moises Clemente", value: 1 },
    { nome: "Cliente 2", value: 2 },
    { nome: "Cliente 3", value: 3 },
    { nome: "Cliente 4", value: 4 },
    { nome: "Cliente 5", value: 5 },
    { nome: "Cliente 6", value: 6 },
    { nome: "Cliente 7", value: 7 },
    { nome: "Cliente 8", value: 8 },
    { nome: "Cliente 9", value: 9 },
    { nome: "Cliente 10", value: 10 },
    { nome: "Cliente 11", value: 11 },
    { nome: "Cliente 12", value: 12 },
    { nome: "Cliente 13", value: 13 },
    { nome: "Cliente 14", value: 14 },
    { nome: "Cliente 15", value: 15 },
    { nome: "Cliente 16", value: 16 },
    { nome: "Cliente 17", value: 17 },
    { nome: "Cliente 18", value: 18 },
    { nome: "Cliente 19", value: 19 },
    { nome: "Cliente 20", value: 20 },
    { nome: "Cliente 21", value: 21 },
    { nome: "Cliente 22", value: 22 },
    { nome: "Cliente 23", value: 23 },
    { nome: "Cliente 24", value: 24 },
    { nome: "Cliente 25", value: 25 },
    { nome: "Cliente 26", value: 26 },
    { nome: "Cliente 27", value: 27 },
    { nome: "Cliente 28", value: 28 },
    { nome: "Cliente 29", value: 29 },
    { nome: "Cliente 30", value: 30 }
  ]

  return (
    <Dialog
      open={isOpen}
      fullWidth
      maxWidth="sm"
    >
      <div style={{ width: "100%", padding: 16 }}>
        {/* INPUT DE PESQUISA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f5f5f5",
            padding: "12px 14px",
            borderRadius: "10px",
            marginBottom: "14px",
          }}
        >
          <i
            className="bi bi-search"
            style={{
              fontSize: "18px",
              color: "#666",
            }}
          />

          <input
            type="search"
            placeholder="Pesquisar cliente..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: "14px",
            }}
          />
        </div>

        {/* LISTA DE CLIENTES */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {data.map((item, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* AVATAR */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#6D28D9",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {item.nome?.charAt(0)}
              </div>

              {/* NOME */}
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#333",
                }}
              >
                {item.nome}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  )
}