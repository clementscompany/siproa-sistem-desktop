export default function UserLogin() {
  return (
    <form className="formContainer">
      <div className="topform">
        <h2>Login</h2>
        <small>Coloque as Suas credenciais para acessar o sistema</small>
      </div>

      <div className="inputBox">
        <i className="bi bi-person"></i>
        <select name="" id="">
          <option value="Selecione o Seu usuário">Selecione a Sua Conta</option>
        </select>
      </div>

      <div className="inputBox">
        <i className="bi bi-lock"></i>
        <input type="password" placeholder="Coloque a sua senha..." />
        <i className="bi bi-eye"></i>
      </div>

      <button className="logBtn">Entrar</button>

      <div className="forgotContainer">
        <a href="#">Esqueceu a senha?</a>
      </div>
    </form>
  )
}