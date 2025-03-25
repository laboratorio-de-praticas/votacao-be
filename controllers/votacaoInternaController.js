import { registrarVoto } from '../services/votacaoInternaService.js';

export const confirmarVoto = (req, res) => {
  try {
    const voto = req.body;

    const sucesso = registrarVoto(voto);

    if (sucesso) {
      res.status(200).json({ mensagem: "Voto registrado com sucesso!" });
    } else {
      res.status(500).json({ mensagem: "Erro ao registrar o voto." });
    }
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro interno ao processar o voto.", erro: erro.message });
  }
};
