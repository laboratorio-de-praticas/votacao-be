import express from 'express';
import { confirmarVoto, verificarElegibilidade } from '../controllers/votacaoInternaController.js';

const router = express.Router();

// Rota POST para registrar voto
router.post('/votacao/interna/confirmacao', confirmarVoto);

// Rota GET para verificar a elegibilidade
router.get('/votacao/interna/confirmacao/verificacao', verificarElegibilidade);

export default router;
