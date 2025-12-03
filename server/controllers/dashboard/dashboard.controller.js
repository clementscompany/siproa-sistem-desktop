import DashboardModule from "../../database/models/dashboard/dashbiard.module.js";

class DashboardController {
  //  Estatísticas gerais da DU
  async getStats(req, res) {
    try {
      const stats = await DashboardModule.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter estatísticas",
        details: error,
      });
    }
  }

  //  Últimas contas
  async getRecentContas(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const contas = await DashboardModule.getRecentContas(limit);
      res.status(200).json({
        success: true,
        data: contas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter contas recentes",
        details: error,
      });
    }
  }

  // Contas por status
  async getContasByStatus(req, res) {
    try {
      const contasStatus = await DashboardModule.getContasByStatus();
      res.status(200).json({
        success: true,
        data: contasStatus,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter contas por status",
        details: error,
      });
    }
  }

  // Transportes recentes
  async getRecentTransportes(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const transportes = await DashboardModule.getRecentTransportes(limit);
      res.status(200).json({
        success: true,
        data: transportes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter transportes recentes",
        details: error,
      });
    }
  }

  // Valores por conta
  async getValoresByConta(req, res) {
    try {
      const { contaId } = req.params;
      const valores = await DashboardModule.getValoresByConta(contaId);
      res.status(200).json({
        success: true,
        data: valores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter valores da conta",
        details: error,
      });
    }
  }

  // Importadores ativos
  async getActiveImportadores(req, res) {
    try {
      const importadores = await DashboardModule.getActiveImportadores();
      res.status(200).json({
        success: true,
        data: importadores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter importadores ativos",
        details: error,
      });
    }
  }

  // Exportadores ativos
  async getActiveExportadores(req, res) {
    try {
      const exportadores = await DashboardModule.getActiveExportadores();
      res.status(200).json({
        success: true,
        data: exportadores,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter exportadores ativos",
        details: error,
      });
    }
  }

  // Adicionar log manual
  async addLog(req, res) {
    try {
      const { tipo, mensagem } = req.body;
      const result = await DashboardModule.addLog(tipo, mensagem);
      res.status(200).json({
        success: true,
        message: "Log adicionado com sucesso",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao adicionar log",
        details: error,
      });
    }
  }

  //  Últimos logs do sistema
  async getRecentLogs(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const logs = await DashboardModule.getRecentLogs(limit);
      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter logs recentes",
        details: error,
      });
    }
  }
}

export default new DashboardController();
