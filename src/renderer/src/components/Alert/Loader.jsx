import "./loader.css";

export default function Loader() {
  return (
    <div className="loaderOverlay">
      <div className="loaderContainer">
        <div className="spinner"></div>
        <span className="loaderText">Carregando...</span>
      </div>
    </div>
  );
}
