import { useEffect, useMemo, useState } from "react";
import logoDefault from "../../assets/img/logo.jpg";
import { systemApi } from "../../api/System.api";
import { appEnv } from "../../env/appEnv";
import { numeroPorExtenso } from "../../utils/numberToExtenso";

export default function SheetCrf({ data, visible = true }) {
  if (!data) return null;


  console.log(data);


  const [logo, setLogo] = useState(logoDefault);
  const [company, setCompany] = useState(null);
  const [headerReady, setHeaderReady] = useState(false);
  const [contasBancarias, setContasBancarias] = useState([]);

  const format = (v) =>
    (parseFloat(v) || 0).toLocaleString("pt-AO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    (async () => {
      try {
        setHeaderReady(false);
        const API = new systemApi();

        const [logoResponse, configResponse, contasResponse] = await Promise.all([
          API.getLogo(),
          API.getConfigApp(),
          fetch(`${appEnv.server}/contas-bancarias`).then(r => r.json())
        ]);

        const logoResult = logoResponse?.result;
        if (logoResult?.imagem) {
          let imagem = logoResult.imagem;
          const isDataUrl = imagem.startsWith("data:");
          const isHttpUrl = /^https?:\/\//i.test(imagem);
          if (!isDataUrl && !isHttpUrl) {
            if (imagem.startsWith("/")) {
              imagem = appEnv.server + imagem;
            } else {
              imagem = `${appEnv.server}/${imagem}`;
            }
          }
          setLogo(imagem);
        } else {
          setLogo(logoDefault);
        }

        const configResult = configResponse?.result;
        if (Array.isArray(configResult) && configResult.length > 0) {
          setCompany(configResult[0]);
        } else {
          setCompany(null);
        }

        setContasBancarias(contasResponse?.result || []);
        setHeaderReady(true);
      } catch (error) {
        console.error("Erro ao carregar dados do cabeçalho:", error);
        setHeaderReady(true);
      }
    })();
  }, []);

  const totals = useMemo(() => {
    const n = (key) => parseFloat(data?.[key]) || 0;

    const subtotal1 =
      n("imposto_s_impo") +
      n("iva") +
      n("imposto_selo") +
      n("sobre_taxa") +
      n("emolumentos_gerais") +
      n("multas_crf");

    const subtotal2 =
      n("ep17") +
      n("ep_15") +
      n("ep_14") +
      n("veterinario_saude") +
      n("validacao_bl") +
      n("assistencia") +
      n("deslocacao") +
      n("servico_transitario");

    const subtotal3 =
      n("honorario") +
      n("inerentes") +
      n("licenciamento") +
      n("declaracao_valor") +
      n("modelo0");

    const totalGeral = subtotal1 + subtotal2 + subtotal3;

    return { subtotal1, subtotal2, subtotal3, totalGeral };
  }, [data]);

  const dataFormatada = data?.criado_em
    ? new Date(data.criado_em).toLocaleDateString("pt-AO")
    : data?.data_entrada
      ? new Date(data.data_entrada).toLocaleDateString("pt-AO")
      : "";

  return (
    <div
      className="sheet-container"
      data-sheet-ready={headerReady ? "1" : "0"}
      style={{ display: visible ? "block" : "none" }}
    >
      <style>{`
        @media print {
          @page { size: A4; margin: 8mm; }
          body { visibility: hidden; }
          .sheet-container, .sheet-container * { visibility: visible; }
          .sheet-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            font-family: Arial, sans-serif;
            font-size: 10px;
            color: #000;
          }
        }

        .row { display: flex; justify-content: space-between; }
        .col { width: 48%; font-size: 9pt; }
        .box { padding: 5px; margin-bottom: 10px; }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }

        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th, td { border: 1px solid #000; padding: 4px; font-size: 10px; }
      `}</style>

      <div className="row" style={{ alignItems: "center", marginBottom: 6, gap: 14 }}>
        <img
          src={logo || logoDefault}
          alt="Logo"
          crossOrigin="anonymous"
          style={{ height: 62, width: 80, objectFit: "contain", borderRadius: 6 }}
        />
        <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
          <div style={{ lineHeight: 1.2, fontSize: 9.5 }}>
            <div className="bold">{company?.empresa_nome || ""}</div>
            {!!company?.empresa_nif && (
              <div>
                <span className="bold">NIF:</span> {company.empresa_nif}
              </div>
            )}
            {!!company?.empresa_endereco && <div>{company.empresa_endereco}</div>}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {!!company?.empresa_telefone && (
                <div>
                  <span className="bold">Tel:</span> {company.empresa_telefone}
                </div>
              )}
              {!!company?.empresa_email && (
                <div>
                  <span className="bold">Email:</span> {company.empresa_email}
                </div>
              )}
            </div>
          </div>
          <div className="right" style={{ minWidth: 165, lineHeight: 1.2, fontSize: 9.5 }}>
            <div>
              <small className="bold" style={{ fontSize: 11 }}>CRF Nº:</small> <small style={{ fontSize: 9.5 }}>{data.numero_crf || ""}</small>
            </div>
            {/* <div className="bold" style={{ fontSize: 11 }}><small>Nº DO PROCESSO: {data.crf_ou_f || ""}</small></div> */}
          </div>
        </div>
      </div>

      <div className="box">
        <div className="row" >
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>Cliente / Empresa</b> {data.cliente_nome || data.cliente || ""}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>Nº do processo</b> {data.crf_ou_f || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>NIF da Empresa</b> {data.cliente_nif || data.nif || ""}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>Moeda</b> {data.moeda || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>Endereço</b> {data.cliente_endereco || ""}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>Câmbio</b> {data.cambio || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>D.U Nº</b> {data.du_numero || ""}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>Valor Aduaneiro</b> {format(data.valor_aduaneiro)}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>B.L Nº</b> {data.bl_numero || ""}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>Via</b> {data.via || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>FOB</b> {format(data.fob)}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>País de Origem</b> {data.pais_nome || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>Frete</b> {format(data.frete)}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>Factura Nº</b> {data.factura || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>Seguro</b> {format(data.seguro)}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>C/Marca Nº</b> {data.c_marca || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <p style={{ margin: "3px 0" }}>
              <b>CIF</b> {format(data.cif)}
            </p>
          </div>
          <div className="col" >
            <p style={{ margin: "3px 0" }}>
              <b>Data de Entrada</b> {data.data_entrada || ""}
            </p>
          </div>
        </div>

        <div style={{ marginTop: 6 }}>
          <p className="bold" style={{ margin: "3px 0" }}>Designação da Mercadoria</p>
          <div style={{ border: "1px dashed #000", padding: 10, minHeight: 28, marginTop: 5, fontSize: "9pt" }}>
            {data.designacao || ""}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr className="center bold">
            <th style={{ width: "5%" }}>Nº</th>
            <th>DESCRIÇÃO</th>
            <th style={{ width: "25%" }}>VALOR (Kz)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Imposto Sobre Importação</td><td className="right">{format(data.imposto_s_impo)}</td></tr>
          <tr><td>2</td><td>IVA</td><td className="right">{format(data.iva)}</td></tr>
          <tr><td>3</td><td>Imposto de Selo</td><td className="right">{format(data.imposto_selo)}</td></tr>
          <tr><td>4</td><td>Emolumentos Gerais</td><td className="right">{format(data.emolumentos_gerais)}</td></tr>
          <tr><td>5</td><td>Sobre Taxa</td><td className="right">{format(data.sobre_taxa)}</td></tr>
          <tr><td>6</td><td>Multas CRF ou Atraso D.U.</td><td className="right">{format(data.multas_crf)}</td></tr>
          <tr className="bold"><td colSpan="2">Subtotal</td><td className="right">{format(totals.subtotal1)}</td></tr>

          <tr><td>7</td><td>EP 17</td><td className="right">{format(data.ep17)}</td></tr>
          <tr><td>8</td><td>EP 15</td><td className="right">{format(data.ep_15)}</td></tr>
          <tr><td>9</td><td>EP 14</td><td className="right">{format(data.ep_14)}</td></tr>
          <tr><td>10</td><td>Veterinário / Saúde</td><td className="right">{format(data.veterinario_saude)}</td></tr>
          <tr><td>11</td><td>Validação do BL</td><td className="right">{format(data.validacao_bl)}</td></tr>
          <tr><td>12</td><td>Assistência</td><td className="right">{format(data.assistencia)}</td></tr>
          <tr><td>13</td><td>Deslocação e Acompanhamento</td><td className="right">{format(data.deslocacao)}</td></tr>
          <tr><td>14</td><td>Serviço Transitário</td><td className="right">{format(data.servico_transitario)}</td></tr>
          <tr className="bold"><td colSpan="2">Subtotal</td><td className="right">{format(totals.subtotal2)}</td></tr>

          <tr><td>15</td><td>Honorário</td><td className="right">{format(data.honorario)}</td></tr>
          <tr><td>16</td><td>Inerentes</td><td className="right">{format(data.inerentes)}</td></tr>
          <tr><td>17</td><td>Licenciamento</td><td className="right">{format(data.licenciamento)}</td></tr>
          <tr><td>18</td><td>Declaração de Valor</td><td className="right">{format(data.declaracao_valor)}</td></tr>
          <tr><td>19</td><td>Modelo O</td><td className="right">{format(data.modelo0)}</td></tr>
          <tr className="bold"><td colSpan="2">Subtotal</td><td className="right">{format(totals.subtotal3)}</td></tr>

          <tr className="bold">
            <td colSpan="2">TOTAL GERAL</td>
            <td className="right">{format(totals.totalGeral)}</td>
          </tr>

          <tr className="bold">
            <td colSpan="2">TOTAL POR EXTENSO</td>
            <td className="right">{data?.total_por_extenso || numeroPorExtenso(totals?.totalGeral)}</td>
          </tr>
        </tbody>
      </table>

      {contasBancarias.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <p className="bold" style={{ margin: "5px 0", fontSize: "10pt", textTransform: "uppercase" }}>Coordenadas Bancárias:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 5 }}>
            {contasBancarias.slice(0, 4).map((conta, index) => (
              <div key={conta.id || index} style={{ fontSize: "9.5pt" }}>
                <b>{conta?.banco || conta?.nome}:</b> {conta?.iban}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="center" style={{ marginTop: 22 }}>
        <b style={{ fontSize: "10pt" }}>A DIREÇÃO</b>
        <div style={{ borderTop: "1px solid #000", width: 180, margin: "8px auto 0" }} />
      </div>
    </div>
  );
}
