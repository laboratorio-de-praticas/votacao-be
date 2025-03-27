import Voto from "../models/VotoPublicoAvaliador.js";
 
 class votoService {
 
   // Função para cadastrar voto
   async Create(nomeAvaliador, projeto, telefone, avaliacao) {
     try {
       const novoVoto = new Voto({
        nomeAvaliador, projeto, telefone, avaliacao
       });
       await novoVoto.save();
     } catch (error) {
       console.log(error);
     }
   }
 }
 
 export default new votoService();