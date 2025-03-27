import VotacaoPublicaService from "../services/VotacaoPublicaService.js";
 
 // Função para cadastrar voto
 const registrarVotoAvaliador = async (req, res) => {
   try {
     const { nomeAvaliador, projeto, telefone, avaliacao} = req.body;
     await VotacaoPublicaService.Create(nomeAvaliador, projeto, telefone, avaliacao);
     res.Status(201).json({ sucess:"Votação cadastrada com sucesso"}); 
   } catch (error) {
     console.log(error);
     res.status(500).json({ error: "Erro interno do servidor" });
   }
 };
 
 export default { registrarVotoAvaliador};