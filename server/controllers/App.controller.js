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
      const imageUrl = `/uploads/images/${req.file.filename}`;

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

  async getContasBancarias(req, res) {
    try {
      const contas = await AppModule.getContasBancarias();
      let contasData = contas[0]?.contabancaria || [];

      // Se for uma string JSON, parseia para array
      if (typeof contasData === "string") {
        try {
          contasData = JSON.parse(contasData);
        } catch (e) {
          contasData = [];
        }
      }

      // Garante que sempre retorne um array
      if (!Array.isArray(contasData)) {
        contasData = [];
      }

      res.status(200).json({ success: true, result: contasData });
    } catch (error) {
      console.error("[AppController] Erro ao obter contas bancárias:", error);
      res.status(500).json({
        success: false,
        message: "erro ao obter contas bancárias",
        details: error,
      });
    }
  }

  async saveContasBancarias(req, res) {
    try {
      const novaConta = req.body;

      // Primeiro, obtemos as contas existentes
      const contasExistentes = await AppModule.getContasBancarias();
      let contasAtualizadas = contasExistentes[0]?.contabancaria || [];

      // Se for uma string JSON, parseia
      if (typeof contasAtualizadas === "string") {
        contasAtualizadas = JSON.parse(contasAtualizadas);
      }

      // Verifica se é uma atualização ou nova conta
      if (novaConta.id !== undefined && novaConta.id !== null) {
        // Atualiza conta existente
        contasAtualizadas = contasAtualizadas.map((conta) =>
          conta.id === novaConta.id ? novaConta : conta,
        );
      } else {
        // Adiciona nova conta com ID único
        novaConta.id = Math.floor(Math.random() * 10000000);
        contasAtualizadas.push(novaConta);
      }

      // Salva as contas atualizadas
      await AppModule.saveContasBancarias(contasAtualizadas);

      res.status(200).json({ success: true, result: contasAtualizadas });
    } catch (error) {
      console.error("[AppController] Erro ao salvar contas bancárias:", error);
      res.status(500).json({
        success: false,
        message: "erro ao salvar contas bancárias",
        details: error,
      });
    }
  }

  async deleteContaBancaria(req, res) {
    try {
      const { id } = req.params;

      // Obtém as contas existentes
      const contasExistentes = await AppModule.getContasBancarias();
      let contasAtualizadas = contasExistentes[0]?.contabancaria || [];

      // Se for uma string JSON, parseia
      if (typeof contasAtualizadas === "string") {
        contasAtualizadas = JSON.parse(contasAtualizadas);
      }

      // Remove a conta pelo ID
      contasAtualizadas = contasAtualizadas.filter(
        (conta) => conta.id !== parseInt(id),
      );

      // Salva as contas atualizadas
      await AppModule.saveContasBancarias(contasAtualizadas);

      res.status(200).json({ success: true, result: contasAtualizadas });
    } catch (error) {
      console.error("[AppController] Erro ao deletar conta bancária:", error);
      res.status(500).json({
        success: false,
        message: "erro ao deletar conta bancária",
        details: error,
      });
    }
  }
}
export default new AppController();
