import { useEffect, useState } from "react";
import logoDefault from "../../assets/img/logo.jpg";
import { systemApi } from "../../api/System.api";
import { appEnv } from "../../env/appEnv";

export default function NotaArquivo({ tipo, arquivo, responsavel }) {
  const [logo, setLogo] = useState(logoDefault);
  const [company, setCompany] = useState(null);
  const [headerReady, setHeaderReady] = useState(false);

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const formatDateTimePt = (d) => {
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("pt-BR");
  };

  useEffect(() => {
    (async () => {
      try {
        setHeaderReady(false);
        const API = new systemApi();

        const [logoResponse, configResponse] = await Promise.all([API.getLogo(), API.getConfigApp()]);

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

        setHeaderReady(true);
      } catch (error) {
        console.error("Erro ao carregar dados do cabeçalho da nota:", error);
        setHeaderReady(true);
      }
    })();
  }, []);

  const titulo = tipo === "DEVOLUCAO" ? "NOTA DE DEVOLUÇÃO" : "NOTA DE ENTREGA";
  const nowStr = formatDateTimePt(new Date());

  const clienteNome = arquivo?.cliente?.nome ?? arquivo?.cliente_nome ?? "—";
  const clienteNif = arquivo?.cliente?.nif ?? arquivo?.cliente_nif ?? "—";
  const clienteMorada = arquivo?.cliente?.morada ?? "—";
  const clienteTelefone = arquivo?.cliente?.telefone ?? "—";

  return (
    <>
      <style>{`
        @page { size: A4; margin: 18mm; }
        @media print {
          body * { visibility: hidden; }
          .nota-container, .nota-container * { visibility: visible; }
          .nota-container { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }

        .row { display: flex; justify-content: space-between; }
        .bold { font-weight: bold; }
      `}</style>

      <div
        className="nota-container"
        data-note-ready={headerReady ? "1" : "0"}
        style={{
          fontFamily: "Arial, sans-serif",
          color: "#111",
          fontSize: 12,
        }}
      >
        <div className="row" style={{ alignItems: "center", marginBottom: 16, gap: 16 }}>
          <img
            src={logo || logoDefault}
            alt="Logo"
            crossOrigin="anonymous"
            style={{ height: 90, width: 90, objectFit: "cover" }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div style={{ lineHeight: 1.25, fontSize: 10 }}>
              <div className="bold">{company?.empresa_nome || ""}</div>
              {!!company?.empresa_nif && (
                <div>
                  <span className="bold">NIF:</span> {company.empresa_nif}
                </div>
              )}
              {!!company?.empresa_endereco && <div>{company.empresa_endereco}</div>}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
            <div style={{ textAlign: "right", lineHeight: 1.3 }}>
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.5 }}>
                {escapeHtml(titulo)} - ARQUIVO
              </div>
              <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>
                <strong>Data/Hora:</strong> {escapeHtml(nowStr)}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 12,
            marginTop: 12,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Cliente</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{escapeHtml(clienteNome)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>NIF</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{escapeHtml(clienteNif)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Morada</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{escapeHtml(clienteMorada)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Telefone</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{escapeHtml(clienteTelefone)}</div>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 12,
            marginTop: 12,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Nº Processo</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {escapeHtml(arquivo?.numero_do_processo || "—")}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Nº DU</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{escapeHtml(arquivo?.numero_du || "—")}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Doc. Transporte</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {escapeHtml(arquivo?.doc_transporte || "—")}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Devolução Prevista</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {escapeHtml(arquivo?.devolucao_prevista_em || "—")}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: "#eee", margin: "14px 0" }}></div>
          <div style={{ fontSize: 11, color: "#555" }}>
            <strong>Responsável:</strong> {escapeHtml(responsavel || "—")}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 22 }}>
          <div>
            <div style={{ borderBottom: "1px solid #111", height: 22 }}></div>
            <div style={{ fontSize: 12, color: "#333", marginTop: 6 }}>Entregou</div>
          </div>
          <div>
            <div style={{ borderBottom: "1px solid #111", height: 22 }}></div>
            <div style={{ fontSize: 12, color: "#333", marginTop: 6 }}>Recebeu</div>
          </div>
        </div>
      </div>
    </>
  );
}
