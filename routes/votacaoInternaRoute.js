import express from 'express';
import votacaoInternaController from '../controllers/votacaoInternaController;js'

const router = express.Router();

// Rota POST para registrar voto
router.post('/votacao/interna/confirmacao', votacaoInternaController.confirmarVoto());

// Rota POST para verificar o voto
router.post('/votacao/interna/confirmacao/verificacao', votacaoInternaController.verficarVoto())

export default router;
