import { appEnv } from "../env/appEnv";

export class systemApi {
  async getConfigApp() {
    try {
      const getData = await fetch(appEnv.server + "/getconfig");
      if (!getData) {
        throw "Erro ao buscar os dados: " + getData.statusText;
      }

      const data = await getData.json();

      return data;
    } catch (error) {
      throw error;
    }
  }

  async saveConfigApp(config) {
    try {
      const postData = await fetch(appEnv.server + "/saveconfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!postData) {
        throw "Erro ao salvar os dados: " + postData.statusText;
      }

      const data = await postData.json();

      return data;
    } catch (error) {
      throw error;
    }
  }
}