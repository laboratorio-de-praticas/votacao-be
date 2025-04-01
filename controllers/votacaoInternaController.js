import { verificarVoto, registrarVoto } from '../models/votacaoInterna.js'

// Rota de confirmação do voto
export const confirmarVoto = async (req, res) => {
  const { id_candidato, id_participante, id_evento } = req.body

  // Obriga a estar com todos os campos preenchidos
  if (!id_candidato || !id_participante || !id_evento) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: id_candidato, id_participante, id_evento.' })
  }

  try {
    // Verifica se o aluno já votou
    const votoExistente = await verificarVoto(id_participante)

    if (votoExistente) {
      return res.status(400).json({ mensagem: 'O voto já foi realizado.' })
    }

    // Se o aluno ainda não votou, registra o voto
    const votoRegistrado = await registrarVoto(id_candidato, id_participante, id_evento)

    return res.status(201).json({ mensagem: 'Voto registrado com sucesso!', voto: votoRegistrado })
  } catch (error) {
    console.error('Erro ao processar o voto:', error)
    return res.status(500).json({ error: 'Erro ao registrar o voto.'})
  }
};

// Rota de verificação do voto e registro do voto se não tiver sido realizado
export const conferirVoto = async (req, res) => {
  const { id_candidato, id_participante, id_evento } = req.body

  // Obriga a estar com todos os campos preenchidos
  if (!id_candidato || !id_participante || !id_evento) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: id_candidato, id_participante, id_evento.' })
  }

  try {
    // Verifica se o aluno já votou
    const votoExistente = await verificarVoto(id_participante)

    if (votoExistente) {
      // Se o aluno já votou, retorna o voto existente
      return res.status(200).json({ mensagem: 'O voto já foi registrado.', voto: votoExistente })
    } else {
      // Se o aluno não votou, registra o voto
      const votoRegistrado = await registrarVoto(id_candidato, id_participante, id_evento)

      return res.status(201).json({ mensagem: 'Voto registrado com sucesso!', voto: votoRegistrado })
    }
  } catch (error) {
    console.error('Erro ao verificar ou registrar voto:', error)
    return res.status(500).json({ error: 'Erro ao verificar ou registrar o voto.'})
  }
}
