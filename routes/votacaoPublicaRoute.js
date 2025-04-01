import express from "express";
const votoRoutes = express.Router();
import votacaoPublicaController from "../controllers/votacaoPublicaController"; "../controllers/votacaoPublicaController.js";
 
votoRoutes.post("/votacao/publica/confirmacao/avaliador", votacaoPublicaController.registrarVotoAvaliador);
 
 export default votoRoutes;