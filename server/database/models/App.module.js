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

  async updateConfigApp(config) {
    try {
      return new Promise((resolve, reject) => {
        const query = `
        UPDATE config
        SET 
          empresa_nome = ?,
          empresa_nif = ?,
          empresa_endereco = ?,
          empresa_telefone = ?,
          empresa_cedula = ?,
          empresa_email = ?,
          moeda_padrao = ?,
          taxa_cambio = ?,
          unidade_padrao = ?,
          tema = ?,
          idioma = ?
        WHERE id = 1
      `;

        DB.run(
          query,
          [
            config.nomeEmpresa,
            config.nif,
            config.enderecoCompleto,
            config.telefone,
            config.cedula,
            config.email,
            config.moeda,
            config.taxa_cambio,
            config.regimeAduaneiro,
            config.corTema,
            config.idioma,
          ],
          function (err) {
            if (err) return reject(err);
            resolve({ success: true, changes: this.changes });
          },
        );
      });
    } catch (error) {
      throw error;
    }
  }

  async getLogoApp() {
    try {
      return new Promise((resolve, reject) => {
        const query = "SELECT * FROM logo_app WHERE active = 1 ORDER BY id DESC LIMIT 1";
        DB.get(query, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async saveLogoApp(logoData) {
    try {
      return new Promise((resolve, reject) => {
        // First deactivate previous logos if any
        DB.run("UPDATE logo_app SET active = 0", (err) => {
            if (err) return reject(err);
            
            const query = `
            INSERT INTO logo_app (imagem) VALUES (?)
            `;
            
            DB.run(query, [logoData.imagem], function(err) {
                if (err) return reject(err);
                resolve({ success: true, id: this.lastID });
            });
        });
      });
    } catch (error) {
      throw error;
    }
  }

  async updateAdminPassword(password) {
    try {
      return new Promise((resolve, reject) => {
        const query = `
        UPDATE config
        SET admin_senha = ?
        WHERE id = 1
      `;
        DB.run(query, [password], function (err) {
          if (err) {
            return reject(err);
          } else {
            resolve({ affectedRows: this.changes });
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
export default new AppModule();
