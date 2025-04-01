import pool from "../config/db.js"  

async function verificarERegistrarVoto(id_candidato, id_participante, id_evento) {
  try {
    // Verificando se o aluno já realizou o voto
    const queryVerificar = 
    `select * from Votos where id_participante = $1 and id_evento = $2;`

    const resultadoVerificacao = await pool.query(queryVerificar, [id_participante, id_evento])

    // Caso o aluno tenha votado, retornar uma mensagem alertando que o voto já foi realizado
    if (resultadoVerificacao.rows.length > 0) {
      return { sucesso: false, mensagem: "O aluno já realizou o voto." }
    }

    // Caso o aluno não tenha votado, registrar o voto no banco
    const queryRegistrar = 
    `insert into Votos (id_candidato, id_participante, id_evento) values ($1, $2, $3);`
    await pool.query(queryRegistrar, [id_candidato, id_participante, id_evento])

    // Retornar uma mensagem de sucesso depois de inserir no banco
    return { sucesso: true, mensagem: "Voto registrado com sucesso!" }
  } catch (error) {
    console.error(error)
    return { sucesso: false, mensagem: "Erro ao processar a solicitação." }
  }
}

export default verificarERegistrarVoto
