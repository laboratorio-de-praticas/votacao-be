import votacaoInterna from "../services/votacaoInternaService.js"
import pool from '../config/db.js'

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

export const verificarVoto = async(req, res) =>{
  // try {
  //   const { id_candidato, id_participante, id_evento } = req.body

  //   // Verifica no banco se o aluno tem um voto registrado
  //   const resultado = await client.query(
  //     `select * from Votos where id_participante = $1;`, [id_participante]
  //   )

  //   // Retorna o código que foi encontrado
  //   const voto = resultado.rows[0]

  //   if (voto !== undefined) {
  //     return res.status(401).json({ error: "O aluno já realizou o voto." })
  //   }

  //   // Registra o voto com base nos campos do banco, caso o aluno ainda não tenha votado
  //   await votoInterno(id_candidato, id_participante, id_evento)

  //   res.status(201).json({ message: "Voto registrado com sucesso!" })

  // } catch (error) {
  //   res.status(500).json({ error: "Erro ao consultar ou registrar voto" })
  // }

  try {
    const voto = req.body;
    
    // Simula que existe um registro de votos
    const votosRegistrados = [
      { id_participante: 1, id_evento: 101 }, // Exemplo de voto registrado
      { id_participante: 2, id_evento: 101 }
    ];
    
    // Verifica se o voto já foi registrado
    const votoExistente = votosRegistrados.find(v => v.id_participante === voto.id_participante && v.id_evento === voto.id_evento);
    
    if (votoExistente) {
      return res.status(400).json({ mensagem: "O voto já foi registrado para este participante." });
    }
    
    // Simula o registro do voto
    votosRegistrados.push({ id_participante: voto.id_participante, id_evento: voto.id_evento });

    // Responde com sucesso
    res.status(200).json({ mensagem: "Voto registrado com sucesso!" });
    
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro interno ao processar o voto.", erro: erro.message });
  }
}


