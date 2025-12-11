import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";

// DADOS MOCKADOS (Gestão Aduaneira)
const mockCRF = [
  {
    id: 1,
    numero_crf: "CRF-2025-001",
    empresa: "TransLog Angola",
    nif: "5001234567",
    tipo_operador: "Importador",
    endereco: "Viana - Zona Industrial",
    telefone: "+244 923 456 789",
    data_emissao: "2024-12-01",
    data_validade: "2025-12-01",
    estado: "Ativo",
  },
  {
    id: 2,
    numero_crf: "CRF-2025-002",
    empresa: "Global Export SA",
    nif: "5407789901",
    tipo_operador: "Exportador",
    endereco: "Lobito - Restinga",
    telefone: "+244 938 890 223",
    data_emissao: "2024-10-15",
    data_validade: "2025-10-15",
    estado: "Ativo",
  },
  {
    id: 3,
    numero_crf: "CRF-2025-003",
    empresa: "Aduana Express",
    nif: "5012298845",
    tipo_operador: "Transitário",
    endereco: "Luanda - Ingombotas",
    telefone: "+244 912 334 556",
    data_emissao: "2023-05-10",
    data_validade: "2024-05-10",
    estado: "Expirado",
  },

  // ---------- A partir daqui, os dados foram gerados ----------
  {
    id: 4,
    numero_crf: "CRF-2025-004",
    empresa: "Tropical Cargo",
    nif: "5023457812",
    tipo_operador: "Importador",
    endereco: "Luanda - Cacuaco",
    telefone: "+244 929 552 110",
    data_emissao: "2024-01-12",
    data_validade: "2025-01-12",
    estado: "Ativo",
  },
  {
    id: 5,
    numero_crf: "CRF-2025-005",
    empresa: "AngoFlete Services",
    nif: "5019982340",
    tipo_operador: "Transitário",
    endereco: "Benguela - Zona Comercial",
    telefone: "+244 938 882 334",
    data_emissao: "2023-11-20",
    data_validade: "2024-11-20",
    estado: "Expirado",
  },
  {
    id: 6,
    numero_crf: "CRF-2025-006",
    empresa: "Kwanza Import",
    nif: "5048872319",
    tipo_operador: "Importador",
    endereco: "Huambo - Bairro Santo",
    telefone: "+244 926 781 221",
    data_emissao: "2024-04-02",
    data_validade: "2025-04-02",
    estado: "Ativo",
  },
  {
    id: 7,
    numero_crf: "CRF-2025-007",
    empresa: "Porto Rápido Angola",
    nif: "5091123345",
    tipo_operador: "Transitário",
    endereco: "Luanda - Mutamba",
    telefone: "+244 914 552 991",
    data_emissao: "2022-09-10",
    data_validade: "2023-09-10",
    estado: "Expirado",
  },
  {
    id: 8,
    numero_crf: "CRF-2025-008",
    empresa: "Express Global Lines",
    nif: "5032119876",
    tipo_operador: "Exportador",
    endereco: "Lubango - Centro",
    telefone: "+244 939 114 220",
    data_emissao: "2024-05-14",
    data_validade: "2025-05-14",
    estado: "Ativo",
  },
  {
    id: 9,
    numero_crf: "CRF-2025-009",
    empresa: "Carga Segura Lda",
    nif: "5078812300",
    tipo_operador: "Transitário",
    endereco: "Cabinda - Chazi",
    telefone: "+244 923 330 118",
    data_emissao: "2023-03-01",
    data_validade: "2024-03-01",
    estado: "Expirado",
  },
  {
    id: 10,
    numero_crf: "CRF-2025-010",
    empresa: "Marítima Export",
    nif: "5034112299",
    tipo_operador: "Exportador",
    endereco: "Namibe - Moçâmedes",
    telefone: "+244 933 887 100",
    data_emissao: "2024-06-11",
    data_validade: "2025-06-11",
    estado: "Ativo",
  },

  ...Array.from({ length: 40 }).map((_, i) => {
    const id = i + 11;
    const num = String(id).padStart(3, "0");

    const empresas = [
      "AngoCargo", "TransExpress", "Lda Logística", "Frota Global",
      "InterTransit", "ViaMar Group", "Portuária Angola", "TransCoast",
      "AeroCargo", "DHL Angola", "Kifangondo Trading", "Bengo Logistics",
    ];

    const operadores = ["Importador", "Exportador", "Transitário"];
    const estados = ["Ativo", "Expirado"];

    const empresa = empresas[i % empresas.length];
    const tipo_operador = operadores[i % operadores.length];
    const estado = estados[i % estados.length];

    return {
      id,
      numero_crf: `CRF-2025-${num}`,
      empresa,
      nif: `50${Math.floor(Math.random() * 89999999 + 10000000)}`,
      tipo_operador,
      endereco: `Luanda - Bairro ${id}`,
      telefone: `+244 9${Math.floor(Math.random() * 99)} ${Math.floor(
        Math.random() * 900000
      ) + 100000}`,
      data_emissao: `2024-0${(i % 9) + 1}-10`,
      data_validade: `2025-0${(i % 9) + 1}-10`,
      estado,
    };
  }),
];




export default function TableCRF({ limit = 0 }) {
  const handleView = (item) => console.log("Ver:", item);
  const handleEdit = (item) => console.log("Editar:", item);
  const handleDelete = (item) => console.log("Eliminar:", item);

  const [data, setData] = useState(mockCRF);

  useEffect(() => {
    setData(limit ? mockCRF.slice(0, limit) : mockCRF);
  }, [limit]);

  return (
    <TableContainer
      component={Paper}
      elevation={3}

    >
      <Table>
        <TableHead>
          <TableRow style={{ background: "var(--primary)" }}>
            <TableCell sx={{ minWidth: 120 }}><strong style={{ color: "var(--color-button)" }}>Nº CRF</strong></TableCell>
            <TableCell sx={{ minWidth: 180 }}><strong style={{ color: "var(--color-button)" }}>Empresa</strong></TableCell>
            <TableCell sx={{ minWidth: 140 }}><strong style={{ color: "var(--color-button)" }}>NIF</strong></TableCell>
            <TableCell sx={{ minWidth: 130 }}><strong style={{ color: "var(--color-button)" }}>Tipo</strong></TableCell>
            <TableCell sx={{ minWidth: 200 }}><strong style={{ color: "var(--color-button)" }}>Endereço</strong></TableCell>
            <TableCell sx={{ minWidth: 150 }}><strong style={{ color: "var(--color-button)" }}>Telefone</strong></TableCell>
            <TableCell sx={{ minWidth: 120 }}><strong style={{ color: "var(--color-button)" }}>Estado</strong></TableCell>
            <TableCell sx={{ minWidth: 150 }} align="center"><strong style={{ color: "var(--color-button)" }} >Ações</strong></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                backgroundColor:
                  item.estado === "Expirado"
                    ? "#ffe5e5"
                    : item.estado === "Ativo"
                      ? "#e8ffe8"
                      : "transparent",
              }}
            >
              <TableCell>{item.numero_crf}</TableCell>
              <TableCell>{item.empresa}</TableCell>
              <TableCell>{item.nif}</TableCell>
              <TableCell>{item.tipo_operador}</TableCell>
              <TableCell>{item.endereco}</TableCell>
              <TableCell>{item.telefone}</TableCell>
              <TableCell><strong>{item.estado}</strong></TableCell>

              <TableCell align="center">
                <Tooltip title="Ver detalhes">
                  <IconButton color="primary" onClick={() => handleView(item)}>
                    <i className="bi bi-eye" style={{ fontSize: 18 }}></i>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Editar">
                  <IconButton color="warning" onClick={() => handleEdit(item)}>
                    <i className="bi bi-pencil-square" style={{ fontSize: 18 }}></i>
                  </IconButton>
                </Tooltip>

                <Tooltip title="Eliminar">
                  <IconButton color="error" onClick={() => handleDelete(item)}>
                    <i className="bi bi-trash" style={{ fontSize: 18 }}></i>
                  </IconButton>
                </Tooltip>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  );

}
