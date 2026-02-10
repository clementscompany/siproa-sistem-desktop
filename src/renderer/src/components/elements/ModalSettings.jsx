import React, { useState, useEffect } from "react";
import "../../assets/main.css";
import { systemApi } from "../../api/System.api";
import { appEnv } from "../../env/appEnv";

export default function ModalSettings({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    nif: "",
    enderecoCompleto: "",
    telefone: "",
    cedula: "",
    email: "",
    moeda: "AOA",
    taxa_cambio: "1",
    regimeAduaneiro: "", // Unidade padrao
    corTema: "light",
    idioma: "pt",
  });
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const api = new systemApi();

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const configRes = await api.getConfigApp();
      if (configRes.success && configRes.result && configRes.result.length > 0) {
        const data = configRes.result[0];
        setFormData({
          nomeEmpresa: data.empresa_nome || "",
          nif: data.empresa_nif || "",
          enderecoCompleto: data.empresa_endereco || "",
          telefone: data.empresa_telefone || "",
          cedula: data.empresa_cedula || "",
          email: data.empresa_email || "",
          moeda: data.moeda_padrao || "AOA",
          taxa_cambio: data.taxa_cambio || "1",
          regimeAduaneiro: data.unidade_padrao || "",
          corTema: data.tema || "light",
          idioma: data.idioma || "pt",
        });
      }

      const logoRes = await api.getLogo();
      if (logoRes.success && logoRes.result) {
        let imagem = logoRes.result.imagem;
        if (imagem && !imagem.startsWith("data:")) {
          // Se for caminho relativo, adiciona o servidor
          if (imagem.startsWith("/")) {
            imagem = appEnv.server + imagem;
          }
        }
        setPreview(imagem);
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Update config
      await api.updateConfigApp(formData);

      // Update logo if changed
      if (logo) {
        await api.saveLogo(logo);
      }

      setMessage({ type: "success", text: "Configurações salvas com sucesso!" });
      setTimeout(() => {
        setMessage(null);
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Erro ao salvar configurações." });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-settings">
      <div className="modalContent" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="headerModal">
          <span>Configuração do Sistema</span>
          <button onClick={onClose} type="button">fechar</button>
        </div>

        {message && (
          <div style={{ padding: 10, marginTop: 10, backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24', borderRadius: 4 }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="inputBox">
              <label htmlFor="nomeEmpresa">Nome da empresa</label>
              <input type="text" name="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox">
              <label htmlFor="nif">NIF</label>
              <input type="text" name="nif" value={formData.nif} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="enderecoCompleto">Endereço</label>
              <input type="text" name="enderecoCompleto" value={formData.enderecoCompleto} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox">
              <label htmlFor="telefone">Telefone</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox">
              <label htmlFor="cedula">Cédula</label>
              <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox" style={{ gridColumn: 'span 2' }}>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox">
              <label htmlFor="moeda">Moeda Padrão</label>
              <input type="text" name="moeda" value={formData.moeda} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox">
              <label htmlFor="taxa_cambio">Taxa de Câmbio</label>
              <input type="text" name="taxa_cambio" value={formData.taxa_cambio} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox">
              <label htmlFor="regimeAduaneiro">Unidade Padrão</label>
              <input type="text" name="regimeAduaneiro" value={formData.regimeAduaneiro} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div className="inputBox">
              <label htmlFor="idioma">Idioma</label>
              <select name="idioma" value={formData.idioma} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="pt">Português</option>
                <option value="en">Inglês</option>
              </select>
            </div>
          </div>

          <div className="inputBox" style={{ marginTop: 20 }}>
            <label>Logotipo da Empresa</label>
            <div style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '4px', marginTop: '5px' }}>
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} id="logo-upload" />
              <label htmlFor="logo-upload" style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}>
                Clique para selecionar uma imagem
              </label>
              {preview && (
                <div style={{ marginTop: 15 }}>
                  <img src={preview} alt="Logo Preview" style={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain' }} />
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? "Salvando..." : "Salvar Configurações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}