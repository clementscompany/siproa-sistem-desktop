import AppModule from "../../database/models/App.module.js";

class AdminController {
  async getPassordAdmin(req, res) {
    try {
      const adminData = await AppModule.getConfigApp();
      if (adminData.length === 0) {
        res.status(404).json({
          success: false,
        });
        return;
      }
      const adminConfig = adminData[0];
      res.status(200).json({
        success: true,
        password: adminConfig.admin_senha,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao obter a senha admin",
        details: error,
      });
    }
  }

  async setPasswordAdmin(req, res) {
    try {
      const { password } = req.body;
      const updateResult = await AppModule.updateAdminPassword(password);
      if (updateResult.affectedRows === 0) {
        res.status(404).json({
          success: false,
          message: "Configuração do aplicativo não encontrada",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Senha admin atualizada com sucesso",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar a senha admin",
        details: error,
      });
    }
  }

  async loginAdmin(req, res) {
    try {
      const adminData = await AppModule.getConfigApp();

      if (adminData.length === 0) {
        res.status(404).json({
          success: false,
          message: "Configuração do aplicativo não encontrada",
        });

        return;
      }
      const adminConfig = adminData[0];
      const { username, password } = req.body;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "erro ao realizar login",
        details: error,
      });
    }
  }
}

export default new AdminController();
