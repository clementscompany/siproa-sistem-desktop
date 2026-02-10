import Menu from "../components/Menu/Menu";
import "./style.css";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="container">
      <div className="menuSide">
        <Menu path={location.pathname} />
      </div>
      <div className="center">
        {children}
      </div>
    </div>
  );
}
