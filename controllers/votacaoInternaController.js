import { registrarVoto, verificarElegibilidade as verificarElegibilidadeService } from '../services/votacaoInternaService.js';

// ROTA POST /votacao/interna/confirmacao
export const confirmarVoto = async (req, res) => {
  try {
    const voto = req.body;

    const { fk_id_aluno, fk_id_evento } = voto;

    // Verifica elegibilidade antes de registrar
    const resultado = await verificarElegibilidadeService(fk_id_aluno, fk_id_evento);

    if (!resultado.elegivel) {
      return res.status(403).json({ mensagem: resultado.motivo });
    }

    const sucesso = await registrarVoto(voto);

    if (sucesso) {
      res.status(200).json({ mensagem: "Voto registrado com sucesso!" });
    } else {
      res.status(500).json({ mensagem: "Erro ao registrar o voto." });
    }
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro interno ao processar o voto.", erro: erro.message });
  }
};

// ROTA GET /votacao/interna/confirmacao/verificacao
export const verificarElegibilidade = async (req, res) => {
  try {
    const { id_aluno, id_evento } = req.query;

    if (!id_aluno || !id_evento) {
      return res.status(400).json({ mensagem: "Parâmetros id_aluno e id_evento são obrigatórios." });
    }

    const resultado = await verificarElegibilidadeService(Number(id_aluno), Number(id_evento));

    if (resultado.elegivel) {
      return res.status(200).json({ mensagem: "Aluno apto a votar." });
    } else {
      return res.status(403).json({ mensagem: resultado.motivo });
    }
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao verificar elegibilidade.", erro: erro.message });
  }
};
