import Menu from "../components/Menu/Menu";
import "./style.css";
export default function Layout({ children, path }) {
  return (
    <div className="container">
      <div className="menuSide">
        <Menu path={path} />
      </div>
      <div className="center">
        {children}
      </div>
    </div>
  )
}