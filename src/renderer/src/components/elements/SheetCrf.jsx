import React, { useEffect, useState } from 'react';
import { systemApi } from '../../api/System.api';
import logo from '../../assets/img/logo.jpg'; // Adjust path if needed

const sysApi = new systemApi();

export default function SheetCrf({ data, visible = true }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    sysApi.getConfigApp().then(setConfig).catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <div className="sheet-container" style={{ display: visible ? 'block' : 'none', background: '#fff' }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .sheet-container, .sheet-container * {
              visibility: visible;
            }
            .sheet-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              display: block !important;
              background: white;
              padding: 20px;
              font-family: Arial, sans-serif;
              color: black;
            }
            @page {
              size: A4;
              margin: 1cm;
            }
          }
        `}
      </style>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <div>
          {/* Placeholder for logo */}
          <img src={logo} alt="Logo" style={{ width: 100 }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <h3>{config?.empresa_nome || "NOME DA EMPRESA"}</h3>
          <p>{config?.empresa_endereco || "Endereço da Empresa"}</p>
          <p>NIF: {config?.empresa_nif || "000000000"} | Tel: {config?.empresa_telefone || "000-000-000"}</p>
          <p>Email: {config?.empresa_email || "email@empresa.com"}</p>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', margin: '10px 0', textDecoration: 'underline' }}>
        Direcção Regional das Alfândegas
      </h2>
      <h3 style={{ textAlign: 'center', margin: '8px 0' }}>
        Requisição de Fundos Nº {data.numero_crf || "PENDENTE"}
      </h3>

      {/* INFO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '12px', fontSize: '12px' }}>
        <div>
          <p><strong>Data de Entrada:</strong> {data.data_entrada}</p>
          <p><strong>C/Marca Nº:</strong> {data.c_marca}</p>
          <p><strong>BL Nº:</strong> {data.bl_numero}</p>
          <p><strong>Via:</strong> {data.via_nome || '---'}</p>
          <p><strong>Origem:</strong> {data.pais_nome || data.origem_nome || '---'}</p>
          <p><strong>FOB:</strong> {formatMoney(data.fob)}</p>
          <p><strong>Frete:</strong> {formatMoney(data.frete)}</p>
          <p><strong>Seguro:</strong> {formatMoney(data.seguro)}</p>
          <p><strong>CIF:</strong> {formatMoney(data.cif)}</p>
        </div>
        <div>
          <p><strong>Cliente/Empresa:</strong> {data.cliente || data.cliente_nome}</p>
          <p><strong>Req. de Fundo Nº:</strong> {data.req_f}</p>
          <p><strong>Moeda:</strong> {data.moeda_nome || data.moeda_id || '---'}</p>
          <p><strong>Câmbio:</strong> {data.cambio}</p>
          <p><strong>Valor Aduaneiro:</strong> {formatMoney(data.valor_aduaneiro)}</p>
          <p><strong>Factura Nº:</strong> {data.factura}</p>
          <p><strong>D.U Nº:</strong> {data.du_numero}</p>
        </div>
      </div>

      {/* TABLE */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Descrição</th>
            <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', width: '150px' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {/* TAXAS */}
          {parseFloat(data.imposto_s_impo) > 0 && (
            <tr><td style={tdStyle}>Direitos Aduaneiros</td><td style={tdRightStyle}>{formatMoney(data.imposto_s_impo)}</td></tr>
          )}
          {parseFloat(data.iva) > 0 && (
            <tr><td style={tdStyle}>IVA</td><td style={tdRightStyle}>{formatMoney(data.iva)}</td></tr>
          )}
          {parseFloat(data.emolumentos_gerais) > 0 && (
            <tr><td style={tdStyle}>Emolumentos Gerais</td><td style={tdRightStyle}>{formatMoney(data.emolumentos_gerais)}</td></tr>
          )}
          {parseFloat(data.imposto_selo) > 0 && (
            <tr><td style={tdStyle}>Imposto de Selo</td><td style={tdRightStyle}>{formatMoney(data.imposto_selo)}</td></tr>
          )}
          {parseFloat(data.sobre_taxa) > 0 && (
            <tr><td style={tdStyle}>Sobre Taxa</td><td style={tdRightStyle}>{formatMoney(data.sobre_taxa)}</td></tr>
          )}
          {parseFloat(data.multas_crf) > 0 && (
            <tr><td style={tdStyle}>Multas</td><td style={tdRightStyle}>{formatMoney(data.multas_crf)}</td></tr>
          )}

          <tr style={{ fontWeight: 'bold', background: '#f9f9f9' }}>
            <td style={tdStyle}>SUBTOTAL IMPOSTOS</td>
            <td style={tdRightStyle}>{formatMoney(data.subtotal)}</td>
          </tr>

          {/* SERVIÇOS */}
          {parseFloat(data.ep17) > 0 && (
            <tr><td style={tdStyle}>EP 17</td><td style={tdRightStyle}>{formatMoney(data.ep17)}</td></tr>
          )}
          {parseFloat(data.veterinario_saude) > 0 && (
            <tr><td style={tdStyle}>Veterinário / Saúde</td><td style={tdRightStyle}>{formatMoney(data.veterinario_saude)}</td></tr>
          )}
          {parseFloat(data.validacao_bl) > 0 && (
            <tr><td style={tdStyle}>Validação BL</td><td style={tdRightStyle}>{formatMoney(data.validacao_bl)}</td></tr>
          )}
          {parseFloat(data.assistencia) > 0 && (
            <tr><td style={tdStyle}>Serviço Transitário</td><td style={tdRightStyle}>{formatMoney(data.assistencia)}</td></tr>
          )}
          {parseFloat(data.deslocacao) > 0 && (
            <tr><td style={tdStyle}>Deslocação</td><td style={tdRightStyle}>{formatMoney(data.deslocacao)}</td></tr>
          )}
          {parseFloat(data.du_valor) > 0 && (
            <tr><td style={tdStyle}>DU</td><td style={tdRightStyle}>{formatMoney(data.du_valor)}</td></tr>
          )}

          {/* EMOLUMENTOS */}
          {parseFloat(data.honorario) > 0 && (
            <tr><td style={tdStyle}>Honorário</td><td style={tdRightStyle}>{formatMoney(data.honorario)}</td></tr>
          )}
          {parseFloat(data.inerentes) > 0 && (
            <tr><td style={tdStyle}>Inerentes</td><td style={tdRightStyle}>{formatMoney(data.inerentes)}</td></tr>
          )}
          {parseFloat(data.licenciamento) > 0 && (
            <tr><td style={tdStyle}>Licenciamento</td><td style={tdRightStyle}>{formatMoney(data.licenciamento)}</td></tr>
          )}
          {parseFloat(data.declaracao_valor) > 0 && (
            <tr><td style={tdStyle}>Declaração de Valor</td><td style={tdRightStyle}>{formatMoney(data.declaracao_valor)}</td></tr>
          )}
          {parseFloat(data.modelo0) > 0 && (
            <tr><td style={tdStyle}>Modelo O</td><td style={tdRightStyle}>{formatMoney(data.modelo0)}</td></tr>
          )}
          {parseFloat(data.fotocopias) > 0 && (
            <tr><td style={tdStyle}>Fotocópias</td><td style={tdRightStyle}>{formatMoney(data.fotocopias)}</td></tr>
          )}
          {parseFloat(data.continuacoes_adicoes) > 0 && (
            <tr><td style={tdStyle}>Continuações/Adições</td><td style={tdRightStyle}>{formatMoney(data.continuacoes_adicoes)}</td></tr>
          )}
          <tr style={{ background: '#f9f9f9' }}>
            <td style={tdStyle}>SubTotal em Kz</td>
            <td style={tdRightStyle}>{formatMoney(data.total_geral)}</td>
          </tr>
          <tr style={{ background: '#f9f9f9' }}>
            <td style={tdStyle}>SubTotal em USD</td>
            <td style={tdRightStyle}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((parseFloat(data.total_geral) || 0) / (parseFloat(data.cambio_usd) || 1 || 1))}</td>
          </tr>

          <tr style={{ fontWeight: 'bold', fontSize: '14px', background: '#ccc' }}>
            <td style={{ border: '1px solid #000', padding: '10px' }}>TOTAL GERAL</td>
            <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'right' }}>{formatMoney(data.total_geral)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '10px', fontSize: '12px' }}>
        <strong>Total por extenso:</strong> {data.total_por_extenso || "---"}
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <div style={{ textAlign: 'center', width: '40%' }}>
          <p>O Elaborador</p>
          <div style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '5px' }}></div>
        </div>
        <div style={{ textAlign: 'center', width: '40%' }}>
          <p>Aprovado por</p>
          <div style={{ borderBottom: '1px solid #000', height: '40px', marginBottom: '5px' }}></div>
        </div>
      </div>
    </div>
  );
}

const tdStyle = { border: '1px solid #000', padding: '5px' };
const tdRightStyle = { border: '1px solid #000', padding: '5px', textAlign: 'right' };

const formatMoney = (val) => {
  return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val || 0);
};
