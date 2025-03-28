import votoInterno from "../modules/votacaoInterna.js";

class votacaoInterna{

  async registrarVoto (votoInterno) {
    console.log("Voto registrado:", votoInterno); // Simulando o registro do voto
    return true;
  };

  async consultarVoto(id_participante) {
    try {

      // Realiza a consulta SQL para verficar se o aluno tem voto registrado
      const query = `select * from Votos where id_participante = $1;`
  
      const resultado = await client.query(query, [id_participante])
      
      // Retorna o voto localizado
      return resultado.rows[0]
  
    } catch (error) {
      console.error("Erro ao consultar voto:", error)
    }
  }
  

}

export default votacaoInterna

