import votacaoInterna from "../services/votacaoInternaService.js";
import { Pool } from "pg";

const confirmarVoto = (req, res) => {
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

const verificarVoto = async(req, res) =>{
  try {
    const { id_candidato, id_participante, id_evento } = req.body

    // Verifica no banco se o aluno tem um voto registrado
    const resultado = await client.query(
      `select * from Votos where id_participante = $1;`, [id_participante]
    )

    // Retorna o código que foi encontrado
    const voto = resultado.rows[0]

    if (voto !== undefined) {
      return res.status(401).json({ error: "O aluno já realizou o voto." })
    }

    // Registra o voto com base nos campos do banco, caso o aluno ainda não tenha votado
    await votoInterno(id_candidato, id_participante, id_evento)

    res.status(201).json({ message: "Voto registrado com sucesso!" })

  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar ou registrar voto" })
  }
}

export default {confirmarVoto, verificarVoto}
