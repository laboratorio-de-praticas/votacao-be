import pool from '../config/db.js'

async function verificarVoto(id_participante) {
  try {
    // Verificar se o aluno já votou
    const query = 'select * from Votos where id_participante = $1'
    const result = await pool.query(query, [id_participante])
    return result.rows[0] // Caso encontrar o voto, retornar ele
  } catch (error) {
    console.error(error)
  }
}

async function registrarVoto(id_candidato, id_participante, id_evento) {
  try {
    // Inserir voto no banco de dados
    const query = `insert into Votos (id_candidato, id_participante, id_evento) values ($1, $2, $3)`
    const result = await pool.query(query, [id_candidato, id_participante, id_evento])
    return result.rows[0] // Retornar o voto inserido
  } catch (error) {
    console.error(error)
  }
}

export { verificarVoto, registrarVoto }
 