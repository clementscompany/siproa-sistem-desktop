import { appEnv } from "../env/appEnv";

export class AnexosApi {
  async listByArquivoId(arquivoId) {
    const response = await fetch(`${appEnv.server}/arquivos/${arquivoId}/anexos`);
    if (!response.ok) throw new Error("Erro ao buscar Anexos");
    return await response.json();
  }

  async upload(arquivoId, file) {
    const form = new FormData();
    form.append("arquivo", file);

    const response = await fetch(`${appEnv.server}/arquivos/${arquivoId}/anexos`, {
      method: "POST",
      body: form,
    });
    if (!response.ok) throw new Error("Erro ao enviar Anexo");
    return await response.json();
  }

  async delete(anexoId) {
    const response = await fetch(`${appEnv.server}/anexos/${anexoId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao eliminar Anexo");
    return await response.json();
  }

  async download(anexoId) {
    const response = await fetch(`${appEnv.server}/anexos/${anexoId}/download`);
    if (!response.ok) throw new Error("Erro ao baixar Anexo");
    const blob = await response.blob();
    const dispo = response.headers.get("content-disposition") || "";
    const match = dispo.match(/filename\\*=UTF-8''([^;]+)|filename=\"?([^\";]+)\"?/i);
    const filename = decodeURIComponent(match?.[1] || match?.[2] || `anexo-${anexoId}`);
    return { blob, filename };
  }
}
