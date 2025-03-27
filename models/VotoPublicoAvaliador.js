import mongoose from "mongoose";
 
 const votoSchema = new mongoose.Schema({
   nomeAvaliador: String,
   projeto: String,
   telefone: Number,
   avaliacao: String,
 });
 
 const Voto = mongoose.model("Voto", votoSchema);
 
 export default Voto;