import { useState } from "react";
import { MiniSpinner } from "../spinner/apinner";
import "./login.css";
import { systemApi } from "../../api/System.api";

export default function PasswordModal({ clodePasswordModal }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState({
    message: "Defina uma senha de acesso ao sistema",
    isError: false,
    isSuccess: false
  });

  const [data, setData] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleSavePassword = async () => {
    setIsLoading(true);

    try {
      if (!data.password || !data.confirmPassword) {
        setMessage({
          message: "Preencha todos os campos.",
          isError: true,
          isSuccess: false
        });
        setIsLoading(false);
        return;
      }

      if (data.password !== data.confirmPassword) {
        setMessage({
          message: "As senhas não coincidem.",
          isError: true,
          isSuccess: false
        });
        setIsLoading(false);
        return;
      }

      const Api = new systemApi();
      const savePassword = await Api.setPasswordAdmin(data.password)
      const { success } = savePassword;
      if (!success === true) {
        setMessage({
          message: savePassword?.message ?? "Erro ao Definir a senha!",
          isError: false,
          isSuccess: true
        });
      }

      setMessage({
        message: "Senha definida com sucesso!",
        isError: false,
        isSuccess: true
      });

      setTimeout(() => {
        setIsLoading(false);
        clodePasswordModal();
      }, 1200);

    } catch (error) {
      setMessage({
        message: "Erro ao definir a senha, tente novamente.",
        isError: true,
        isSuccess: false
      });
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((before) => ({
      ...before,
      [name]: value
    }));
  };

  return (
    <div className="passwordModal">
      <div className="contentModal">
        <div className="topModal">
          <h2>Definir senha</h2>
          <small
            style={{
              color: message.isError
                ? "var(--error-text)"
                : message.isSuccess
                  ? "var(--success-text)"
                  : "var(--text1)"
            }}
          >
            {message.message}
          </small>
          <button className="closebutton" onClick={clodePasswordModal}><i className="bi bi-x"></i></button>
        </div>

        <div className="inputBox">
          <i className="bi bi-lock"></i>
          <input
            type={visible === true ? "text" : "password"}
            placeholder="Digite a sua senha"
            name="password"
            value={data.password}
            onChange={handleChange}
          />
          {
            visible === false ?
              <i className="bi bi-eye" onClick={() => setVisible(true)}></i>
              :
              <i className="bi bi-eye-slash" onClick={() => setVisible(false)}></i>}
        </div>

        <div className="inputBox">
          <i className="bi bi-lock"></i>
          <input
            type="password"
            placeholder="Confirme a sua senha"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button className="sendBtn" onClick={handleSavePassword}>
          Salvar
          {isLoading && <MiniSpinner />}
        </button>
      </div>
    </div>
  );
}
