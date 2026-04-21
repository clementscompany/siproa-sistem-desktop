import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import logo from "../../assets/img/logo.jpg";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;  // ex: /home, /crf, /clientes

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
        { name: "Nova Requisição", path: "/nova-requisicao" },
      ],
    },

    // {
    //   name: "Faturas",
    //   icon: <i className="bi bi-receipt"></i>,
    //   submenu: [
    //     { name: "Todas as Faturas", path: "/faturas" },
    //     { name: "Cadastrar Fatura", path: "/faturas/nova" },
    //     { name: "Pendentes", path: "/faturas/pendentes" },
    //     { name: "Pagas", path: "/faturas/pagas" },
    //   ],
    // },

    {
      name: "Arquivos",
      icon: <i className="bi bi-folder2-open"></i>,
      submenu: [
        { name: "Todos os Arquivos", path: "/arquivos" },
      ],
    },
    {
      name: "Processos",
      icon: <i className="bi bi-kanban"></i>,
      path: "/processos",
    },

    // {
    //   name: "Pauta Aduaneira",
    //   icon: <i className="bi bi-journal-text"></i>,
    //   submenu: [
    //     { name: "Consultar Pauta", path: "/pauta" },
    //     { name: "Códigos SH", path: "/pauta/codigos" },
    //     { name: "Taxas & Impostos", path: "/pauta/taxas" },
    //   ],
    // },

    {
      name: "Clientes",
      icon: <i className="bi bi-building"></i>,
      submenu: [
        { name: "Lista", path: "/clientes" },
        { name: "Cadastrar", path: "/clientes/cadastrar" },
      ],
    },

    // {
    //   name: "Exportadores",
    //   icon: <i className="bi bi-box-arrow-up-right"></i>,
    //   submenu: [
    //     { name: "Lista", path: "/exportadores" },
    //     { name: "Cadastrar", path: "/exportadores/cadastrar" },
    //   ],
    // },

    // {
    //   name: "Configurações",
    //   icon: <i className="bi bi-gear"></i>,
    //   submenu: [
    //     { name: "Usuários", path: "/settings/users" },
    //     { name: "Permissões", path: "/settings/permissions" },
    //     { name: "Temas", path: "/settings/themes" },
    //   ],
    // },
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
        {dataPath.map((item, index) => {
          const isGroupActive =
            item.path === path ||
            item.submenu?.some((sub) => sub.path === path);
          return (
            <li
              key={index}
              className={`menu-group ${isGroupActive ? "active" : ""} ${openSubmenu === index ? "open" : ""
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
                    className={`bi ${openSubmenu === index
                      ? "bi-chevron-up"
                      : "bi-chevron-down"
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
          );
        })}
      </ul>
    </div>
  );
}
