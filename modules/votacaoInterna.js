async function votoInterno(id_candidato, id_participante, id_evento) {
    // Faz a inserção no banco de dados
    const query = `insert into Votos (id_candidato, id_participante, id_evento)
      values ($1, $2, $3);`
    
    try {
      
      await client.query(query, [id_candidato, id_participante, id_evento])
      console.log("Voto inserido com sucesso!")
      
    } catch (error) {
      console.error("Erro ao inserir voto:", error)
    }
  }

export default votoInterno

  