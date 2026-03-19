import { DB } from "../../db.js";

class DashboardModule {
  // 1️⃣ Estatísticas gerais da DU
  async getStats() {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT
            (SELECT COUNT(*) FROM contas) AS totalContas,
            (SELECT COUNT(*) FROM importadores) AS totalClientes,
            (SELECT COUNT(*) FROM exportadores) AS totalExportadores,
            (SELECT COUNT(*) FROM transporte) AS totalTransportes,
            (SELECT COUNT(*) FROM crf WHERE active = 1) AS totalCrf,
            (SELECT SUM(total) FROM contas) AS faturamentoTotal
        `;
        DB.all(query, (err, data) => {
          if (err) reject(err);
          else resolve(data[0]);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 2️⃣ Últimas contas criadas
  async getRecentContas(limit = 10) {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT c.id, c.codigo_conta, c.data_abertura, c.total, c.status,
                 i.nome AS importador, e.nome AS exportador, d.nome AS despachante
          FROM contas c
          LEFT JOIN importadores i ON c.importador_id = i.id
          LEFT JOIN exportadores e ON c.exportador_id = e.id
          LEFT JOIN despachantes d ON c.despachante_id = d.id
          ORDER BY c.criado_em DESC
          LIMIT ?
        `;
        DB.all(query, [limit], (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 3️⃣ Contas por status
  async getContasByStatus() {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT status, COUNT(*) AS total
          FROM contas
          GROUP BY status
        `;
        DB.all(query, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 4️⃣ Transportes recentes
  async getRecentTransportes(limit = 10) {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT t.id, t.tipo, t.meio_transporte, t.data_partida, t.data_chegada,
                 p.nome AS porto, c.codigo_conta
          FROM transporte t
          LEFT JOIN portos p ON t.porto_fronteira_id = p.id
          LEFT JOIN contas c ON t.conta_id = c.id
          ORDER BY t.created_at DESC
          LIMIT ?
        `;
        DB.all(query, [limit], (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 5️⃣ Produtos/valores com base em DU
  async getValoresByConta(contaId) {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT *
          FROM valores
          WHERE conta_id = ?
          ORDER BY created_at DESC
        `;
        DB.all(query, [contaId], (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 6️⃣ Buscar importadores ativos
  async getActiveImportadores() {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT id, codigo, nome, nif, telefone, email
          FROM importadores
          WHERE active = 1
          ORDER BY nome ASC
        `;
        DB.all(query, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 7️⃣ Buscar exportadores ativos
  async getActiveExportadores() {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT id, codigo, nome, nif, telefone, email
          FROM exportadores
          WHERE active = 1
          ORDER BY nome ASC
        `;
        DB.all(query, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 8️⃣ Adicionar log da dashboard
  async addLog(tipo, mensagem) {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO logs (tipo, mensagem, data_hora)
          VALUES (?, ?, datetime('now'))
        `;
        DB.run(query, [tipo, mensagem], function (err) {
          if (err) reject(err);
          else resolve({ success: true, id: this.lastID });
        });
      });
    } catch (error) {
      throw error;
    }
  }

  // 9️⃣ Últimos logs do sistema
  async getRecentLogs(limit = 20) {
    try {
      return new Promise((resolve, reject) => {
        const query = `
          SELECT id, tipo, mensagem, data_hora
          FROM logs
          ORDER BY data_hora DESC
          LIMIT ?
        `;
        DB.all(query, [limit], (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new DashboardModule();
