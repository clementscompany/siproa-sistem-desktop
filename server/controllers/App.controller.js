import AppModule from "../database/models/App.module.js";

class AppController {
  async getConfig(req, res) {
    try {
      const result = await AppModule.getConfigApp();
      let data = {
        success: true,
        result,
      };

      if (!(result.length > 0)) {
        data = {
          success: false,
          message: "nenhum dado encontrado",
        };
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "erro ao obter os dados",
        details: error,
      });
    }
  }

  async saveConfig(req, res) {
    try {
      const config = req.body;
      const result = await AppModule.saveConfigApp(config);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "erro ao salvar os dados",
        details: error,
      });
    }
  }

  async updateConfig(req, res) {
    try {
      const config = req.body;
      const result = await AppModule.updateConfigApp(config);

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "erro ao atualizar os dados",
        details: error,
      });
    }
  }

  async getLogo(req, res) {
    try {
      const result = await AppModule.getLogoApp();
      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "erro ao obter logo",
        details: error,
      });
    }
  }

  async saveLogo(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Imagem é obrigatória" });
      }

      // Constrói a URL da imagem
      const imageUrl = `/uploads/${req.file.filename}`;

      const result = await AppModule.saveLogoApp({ imagem: imageUrl });

      res.status(200).json({
        success: true,
        result: { ...result, imagem: imageUrl },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "erro ao salvar logo",
        details: error,
      });
    }
  }
}
export default new AppController();
