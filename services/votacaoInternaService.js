import db from '../config/db.js';

export const verificarElegibilidade = async (idAluno, idEvento) => {
  // Verificar se aluno existe e está ativo
  const alunoAtivo = await db.query(`
    SELECT a.id_aluno, u.status_usuario, a.curso_semestre
    FROM "Alunos" a
    JOIN "Usuarios" u ON a.fk_id_usuario = u.id
    WHERE a.id_aluno = $1 AND u.status_usuario = 'Ativo'
  `, [idAluno]);

  if (alunoAtivo.rowCount === 0) {
    return { elegivel: false, motivo: "Aluno não encontrado ou inativo" };
  }

  const cursoAluno = alunoAtivo.rows[0].curso_semestre;

  // Verificar se evento está em andamento
  const evento = await db.query(`
    SELECT *
    FROM "Eventos"
    WHERE id_evento = $1
      AND data_inicio <= NOW()
      AND data_fim >= NOW()
  `, [idEvento]);

  if (evento.rowCount === 0) {
    return { elegivel: false, motivo: "Evento fora do período de votação" };
  }

  const dadosEvento = evento.rows[0];

  // Verificar se aluno já votou
  const votoExistente = await db.query(`
    SELECT *
    FROM "VotosInternos"
    WHERE fk_id_aluno = $1 AND fk_id_evento = $2
  `, [idAluno, idEvento]);

  if (votoExistente.rowCount > 0) {
    return { elegivel: false, motivo: "Aluno já votou neste evento" };
  }

  // Verificar se o curso do aluno bate com o do evento
  if (dadosEvento.curso_semestre !== cursoAluno) {
    return { elegivel: false, motivo: "Curso/Semestre do aluno incompatível com o do evento" };
  }

  // Verificar se tipo do evento é 'Interno'
  if (dadosEvento.tipo_evento !== 'Interno') {
    return { elegivel: false, motivo: "Evento não é do tipo Interno" };
  }

  return { elegivel: true };
};

export const registrarVoto = async (voto) => {
  try {
    const { fk_id_evento, fk_id_aluno, fk_id_representante } = voto;

    await db.query(`
      INSERT INTO "VotosInternos" (fk_id_evento, fk_id_aluno, fk_id_representante, data_criacao)
      VALUES ($1, $2, $3, NOW())
    `, [fk_id_evento, fk_id_aluno, fk_id_representante]);

    return true;
  } catch (erro) {
    console.error("Erro ao registrar o voto:", erro.message);
    return false;
  }
};
