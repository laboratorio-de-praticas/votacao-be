import votacaoPublicaService from "../services/VotacaoPublicaService.js";
 
async function registrarVoto(id_candidato, id_participante, id_evento) {
  try {

    const query = `insert into Votos (id_candidato, id_participante, id_evento) values ($1, $2, $3)`
    const result = await pool.query(query, [id_candidato, id_participante, id_evento])
    return result.rows[0] 
  } catch (error) {
    console.error(error)
  }
}
 
 export default { registrarVoto};