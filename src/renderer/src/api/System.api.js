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

  async getPasswordAdmin() {
    try {
      const getData = await fetch(appEnv.server + "/getpassword");
      if (!getData) {
        throw "Erro ao buscar a senha admin: " + getData.statusText;
      }

      const data = await getData.json();

      return data;
    } catch (error) {
      throw error;
    }
  }

  async setPasswordAdmin(password) {
    try {
      const postData = await fetch(appEnv.server + "/setpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!postData) {
        throw "Erro ao salvar a senha admin: " + postData.statusText;
      }
      const data = await postData.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async loginAdmin(password) {
    try {
      const postData = await fetch(appEnv.server + "/loginadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!postData) {
        throw "Erro ao realizar login admin: " + postData.statusText;
      }
      const data = await postData.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const getData = await fetch(appEnv.server + "/dashboard/stats");
      if (!getData) {
        throw "Erro ao buscar os dados do dashboard: " + getData.statusText;
      }
      const data = await getData.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}
