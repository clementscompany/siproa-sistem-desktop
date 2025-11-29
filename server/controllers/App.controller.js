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
}
export default new AppController();
