import { useState } from "react";
import "./settings.css";
import Alert from "../Alert/Alert";
import { systemApi } from "../../api/System.api";

export default function Settings() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState({ open: false, message: "", status: "", title: "" })
  const Api = new systemApi();
  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    // validar em tempo real
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    let tempErrors = {};

    if (step === 1) {
      if (!data.nomeEmpresa) tempErrors.nomeEmpresa = "Campo obrigatório";
      if (!data.nif) tempErrors.nif = "Campo obrigatório";
      if (!data.responsavel) tempErrors.responsavel = "Campo obrigatório";
      if (!data.cedula) tempErrors.cedula = "Campo obrigatório";
    }

    if (step === 2) {
      if (!data.provincia) tempErrors.provincia = "Campo obrigatório";
      if (!data.municipio) tempErrors.municipio = "Campo obrigatório";
      if (!data.telefone) tempErrors.telefone = "Campo obrigatório";
      else if (!/^\d{9,11}$/.test(data.telefone.replace(/\D/g, "")))
        tempErrors.telefone = "Telefone inválido";

      if (!data.email) tempErrors.email = "Campo obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        tempErrors.email = "Email inválido";
    }

    if (step === 3) {
      if (!data.moeda) tempErrors.moeda = "Campo obrigatório";
      if (!data.regimeAduaneiro) tempErrors.regimeAduaneiro = "Campo obrigatório";
      if (!data.corTema) tempErrors.corTema = "Campo obrigatório";
      if (!data.idioma) tempErrors.idioma = "Campo obrigatório";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      try {
        const sendData = await Api.saveConfigApp(data);

      } catch (error) {
        setAlertMessage({
          open: true,
          message: "Erro ao salvar as configurações do sistema",
          status: "erro",
          title: "Erro inesperado!"
        });
        setTimeout(() => setAlertMessage(prev => ({ ...prev, open: false })), 3000);
      }

      // Fechar automaticamente após 3 segundos
    }
  };

  const hendleCloseBodal = () => {
    setAlertMessage({
      open: false,
      message: "",
      status: "",
      title: ""
    });

  }

  return (
    <div className="settingsPage">
      {/* LADO ESQUERDO */}
      <div className="leftSide">
        <h2>Configurações Iniciais</h2>
        <p className="info">
          Organize os dados básicos da empresa e personalize o sistema antes de começar a utilizar.
        </p>

        <ul className="stepsInfo">
          <li className={step === 1 ? "active" : ""}>Dados da Empresa</li>
          <li className={step === 2 ? "active" : ""}>Endereço & Contactos</li>
          <li className={step === 3 ? "active" : ""}>Preferências do Sistema</li>
        </ul>
      </div>

      {/* LADO DIREITO FORM */}
      <div className="rightSide card">
        <h3>
          {step === 1 && "Dados da Empresa"}
          {step === 2 && "Endereço & Contactos"}
          {step === 3 && "Preferências do Sistema"}
        </h3>

        <form className="formGrid" onSubmit={handleSubmit}>

          {step === 1 && (
            <>
              <div className="formGroup">
                <label>Nome da Empresa</label>
                <input
                  type="text"
                  name="nomeEmpresa"
                  placeholder="Ex: Nome da empresa"
                  value={data.nomeEmpresa || ""}
                  onChange={handleInput}
                />
                {errors.nomeEmpresa && <small>{errors.nomeEmpresa}</small>}
              </div>

              <div className="formGroup">
                <label>NIF</label>
                <input
                  type="text"
                  name="nif"
                  placeholder="Número de Identificação Fiscal"
                  value={data.nif || ""}
                  onChange={handleInput}
                />
                {errors.nif && <small>{errors.nif}</small>}
              </div>

              <div className="formGroup">
                <label>Responsável</label>
                <input
                  type="text"
                  name="responsavel"
                  placeholder="Nome do administrador do sistema"
                  value={data.responsavel || ""}
                  onChange={handleInput}
                />
                {errors.responsavel && <small>{errors.responsavel}</small>}
              </div>

              <div className="formGroup">
                <label>Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  placeholder="000-000-000"
                  value={data.cedula || ""}
                  onChange={handleInput}
                />
                {errors.cedula && <small>{errors.cedula}</small>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="formGroup">
                <label>Província</label>
                <input
                  type="text"
                  name="provincia"
                  placeholder="Luanda"
                  value={data.provincia || ""}
                  onChange={handleInput}
                />
                {errors.provincia && <small>{errors.provincia}</small>}
              </div>

              <div className="formGroup">
                <label>Município</label>
                <input
                  type="text"
                  name="municipio"
                  placeholder="Belas"
                  value={data.municipio || ""}
                  onChange={handleInput}
                />
                {errors.municipio && <small>{errors.municipio}</small>}
              </div>

              <div className="formGroup">
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  placeholder="Ex: 923 000 000"
                  value={data.telefone || ""}
                  onChange={handleInput}
                />
                {errors.telefone && <small>{errors.telefone}</small>}
              </div>

              <div className="formGroup">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="empresa@email.com"
                  value={data.email || ""}
                  onChange={handleInput}
                />
                {errors.email && <small>{errors.email}</small>}
              </div>

              <div className="formGroup full">
                <label>Endereço Completo (opcional)</label>
                <input
                  type="text"
                  name="enderecoCompleto"
                  placeholder="Ex: Rua 123, Bairro Tal"
                  value={data.enderecoCompleto || ""}
                  onChange={handleInput}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="formGroup">
                <label>Moeda Padrão</label>
                <input
                  type="text"
                  name="moeda"
                  placeholder="Ex: Kwanza (AOA)"
                  value={data.moeda || ""}
                  onChange={handleInput}
                />
                {errors.moeda && <small>{errors.moeda}</small>}
              </div>

              <div className="formGroup">
                <label>Regime Aduaneiro</label>
                <input
                  type="text"
                  name="regimeAduaneiro"
                  placeholder="Ex: Importação / Exportação"
                  value={data.regimeAduaneiro || ""}
                  onChange={handleInput}
                />
                {errors.regimeAduaneiro && <small>{errors.regimeAduaneiro}</small>}
              </div>

              <div className="formGroup">
                <label>Cor do Tema</label>
                <select
                  name="corTema"
                  value={data.corTema || ""}
                  onChange={handleInput}
                >
                  <option value="">Selecione uma cor</option>
                  <option value="Azul">Azul</option>
                  <option value="Vermelho">Vermelho</option>
                  <option value="Verde">Verde</option>
                  <option value="Roxo">Roxo</option>
                  <option value="Amarelo">Amarelo</option>
                </select>
                {errors.corTema && <small>{errors.corTema}</small>}
              </div>

              <div className="formGroup">
                <label>Idioma</label>
                <select
                  name="idioma"
                  value={data.idioma || ""}
                  onChange={handleInput}
                >
                  <option value="">Selecione um idioma</option>
                  <option value="Português">Português</option>
                  <option value="Inglês">Inglês</option>
                  <option value="Francês">Francês</option>
                  <option value="Espanhol">Espanhol</option>
                </select>
                {errors.idioma && <small>{errors.idioma}</small>}
              </div>


              <div className="formGroup full">
                <label>Observações</label>
                <input
                  type="text"
                  name="observacoes"
                  placeholder="Notas adicionais"
                  value={data.observacoes || ""}
                  onChange={handleInput}
                />
              </div>
            </>
          )}
        </form>

        {/* BOTÕES DE NAVEGAÇÃO */}
        <div className="navButtons">
          {step > 1 && <button onClick={prevStep}>Voltar</button>}
          {step < 3 && <button className="btn-primary" onClick={nextStep}>Avançar</button>}
          {step === 3 && <button className="btn-primary" onClick={handleSubmit}>Salvar Configurações</button>}
        </div>
      </div>

      {alertMessage.open === true && <Alert message={alertMessage.message} title={alertMessage.title}
        onClose={hendleCloseBodal}
      />}
    </div>
  );
}
