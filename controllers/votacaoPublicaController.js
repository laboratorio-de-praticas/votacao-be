// controllers/votacaoPublicaController.js
import getWelcomeMessage, { registrarVotoPublico } from '../services/votacaoPublicaService.js';

const getHome = (req, res) => {
  try {
    const message = getWelcomeMessage();
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send('Erro ao processar requisição');
  }
};

export const registrarVotoConvidado = async (req, res) => {
  try {
    const votoData = req.body;
    
    // Validação básica
    if (!votoData.nome_social || !votoData.celular || !votoData.chave_acesso || !votoData.voto) {
      return res.status(400).json({ mensagem: "Dados incompletos para registro do voto." });
    }

    const sucesso = await registrarVotoPublico(votoData);

    if (sucesso) {
      res.status(200).json({ mensagem: "Voto de convidado registrado com sucesso!" });
    } else {
      res.status(500).json({ mensagem: "Erro ao registrar o voto." });
    }
  } catch (erro) {
    res.status(500).json({ 
      mensagem: "Erro interno ao processar o voto de convidado.", 
      erro: erro.message 
    });
  }
};

export default getHome;