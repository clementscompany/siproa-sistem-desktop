import { DB } from "../db.js";

class AppModule {
  async getConfigApp() {
    try {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM config LIMIT 1";
        DB.all(query, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async saveConfigApp(config) {
    try {
      return new Promise((resolve, reject) => {
        const selectConfig = "SELECT * FROM config LIMIT 1";

        const query = `
        INSERT INTO config (
          empresa_nome,
          empresa_nif,
          empresa_endereco,
          empresa_telefone,
          empresa_cedula,
          empresa_email,
          admin_usuario,
          moeda_padrao,
          taxa_cambio,
          unidade_padrao,
          tema,
          idioma
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

        DB.all(selectConfig, (err, row) => {
          if (err) return reject(err);

          if (row.length > 0) {
            return resolve({
              success: false,
              message: "Configuração já existe",
            });
          }

          DB.run(
            query,
            [
              config.nomeEmpresa,
              config.nif,
              `${config.provincia}, ${config.municipio} : ${config.enderecoCompleto}`,
              config.telefone,
              config.cedula,
              config.email,
              config.responsavel,
              config.moeda,
              config.taxa_cambio || "1",
              config.regimeAduaneiro,
              config.corTema,
              config.idioma,
            ],
            function (err) {
              if (err) return reject(err);
              resolve({ success: true, id: this.lastID });
            },
          );
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
export default new AppModule();
