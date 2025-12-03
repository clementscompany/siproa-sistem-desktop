import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logo from "../../assets/img/logo.jpg";

export default function Menu({ path }) {
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const handleToggle = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const dataPath = [
    {
      name: "Dashboard",
      icon: <i className="bi bi-speedometer2"></i>,
      path: "/home",
    },

    {
      name: "CRF",
      icon: <i className="bi bi-cash-stack"></i>,
      submenu: [
        { name: "Lista de CRFs", path: "/crf" },
        { name: "Nova Requisição", path: "/crf/nova" },
        { name: "Aprovadas", path: "/crf/aprovadas" },
        { name: "Pendentes", path: "/crf/pendentes" },
      ],
    },

    {
      name: "Faturas",
      icon: <i className="bi bi-receipt"></i>,
      submenu: [
        { name: "Todas as Faturas", path: "/faturas" },
        { name: "Cadastrar Fatura", path: "/faturas/nova" },
        { name: "Pendentes", path: "/faturas/pendentes" },
        { name: "Pagas", path: "/faturas/pagas" },
      ],
    },

    {
      name: "Arquivos",
      icon: <i className="bi bi-folder2-open"></i>,
      submenu: [
        { name: "Todos os Arquivos", path: "/arquivos" },
        { name: "Upload de Arquivo", path: "/arquivos/upload" },
        { name: "Categorias", path: "/arquivos/categorias" },
      ],
    },

    {
      name: "Pauta Aduaneira",
      icon: <i className="bi bi-journal-text"></i>,
      submenu: [
        { name: "Consultar Pauta", path: "/pauta" },
        { name: "Códigos SH", path: "/pauta/codigos" },
        { name: "Taxas & Impostos", path: "/pauta/taxas" },
      ],
    },

    {
      name: "Importadores",
      icon: <i className="bi bi-building"></i>,
      submenu: [
        { name: "Lista", path: "/importadores" },
        { name: "Cadastrar", path: "/importadores/cadastrar" },
        { name: "Documentação", path: "/importadores/docs" },
      ],
    },

    {
      name: "Exportadores",
      icon: <i className="bi bi-box-arrow-up-right"></i>,
      submenu: [
        { name: "Lista", path: "/exportadores" },
        { name: "Cadastrar", path: "/exportadores/cadastrar" },
        { name: "Documentação", path: "/exportadores/docs" },
      ],
    },

    {
      name: "Configurações",
      icon: <i className="bi bi-gear"></i>,
      submenu: [
        { name: "Usuários", path: "/settings/users" },
        { name: "Permissões", path: "/settings/permissions" },
        { name: "Temas", path: "/settings/themes" },
      ],
    },
  ];

  return (
    <div className="menu">
      <div className="logo">
        <div className="logoimage">
          <img src={logo} alt="Logo image" />
        </div>
        <h4>SIPROA</h4>
      </div>

      <ul>
        {dataPath.map((item, index) => (
          <li
            key={index}
            className={`menu-group ${path === item.path ? "active" : ""} ${openSubmenu === index ? "open" : ""
              }`}
          >
            <div
              className="menu-item"
              onClick={() =>
                item.submenu ? handleToggle(index) : navigate(item.path)
              }
            >
              {item.icon}
              <span>{item.name}</span>
              {item.submenu && (
                <i
                  className={`bi ${openSubmenu === index ? "bi-chevron-up" : "bi-chevron-down"
                    } arrow`}
                ></i>
              )}
            </div>

            {item.submenu && (
              <ul
                className={`submenu ${openSubmenu === index ? "submenu-open" : ""
                  }`}
              >
                {item.submenu.map((sub, subIndex) => (
                  <li
                    key={subIndex}
                    onClick={() => navigate(sub.path)}
                    className={path === sub.path ? "active" : ""}
                  >
                    <i className="bi bi-dot"></i>
                    <span>{sub.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
