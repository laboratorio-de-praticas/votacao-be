import express from 'express';
import { confirmarVoto } from '../controllers/votacaoInternaController.js';

const router = express.Router();

// Rota POST para registrar voto
router.post('/votacao/interna/confirmacao', confirmarVoto);

export default router;
