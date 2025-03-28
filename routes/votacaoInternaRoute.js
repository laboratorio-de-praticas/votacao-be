import express from 'express';
import {confirmarVoto, verificarVoto} from '../controllers/votacaoInternaController.js';

const router = express.Router();

// Rota POST para registrar voto
router.get('/votacao/interna/confirmacao', confirmarVoto);

// Rota POST para verificar o voto
router.get('/votacao/interna/confirmacao/validacao', verificarVoto)

export default router;
