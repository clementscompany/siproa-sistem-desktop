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

  async updateConfigApp(config) {
    try {
      const postData = await fetch(appEnv.server + "/updateconfig", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!postData) {
        throw "Erro ao atualizar os dados: " + postData.statusText;
      }
      const data = await postData.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getLogo() {
    try {
      const getData = await fetch(appEnv.server + "/getlogo");
      if (!getData) {
        throw "Erro ao buscar logo: " + getData.statusText;
      }
      const data = await getData.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async saveLogo(file) {
    try {
      const formData = new FormData();
      formData.append("imagem", file);

      const postData = await fetch(appEnv.server + "/savelogo", {
        method: "POST",
        body: formData, // Fetch automaticamente seta o Content-Type para multipart/form-data
      });

      if (!postData.ok) {
        // Check for HTTP errors (like 413, 500, etc.)
        throw "Erro ao salvar logo: " + postData.statusText;
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
