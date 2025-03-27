import express from "express";
const votoRoutes = express.Router();
import VotacaoPublicaController from "../controllers/VotacaoPublicaController.js";
 
 
 // Endpoint para registrar o voto
 votoRoutes.post("/votacao/publica/avaliadores/confirmacao", VotacaoPublicaController.registrarVotoAvaliador);

 // Endpoint para 
 
 export default votoRoutes;