import express from 'express'
import { confirmarVoto, conferirVoto } from '../controllers/votacaoInternaController.js'

const router = express.Router()

// Rota POST para registrar voto
router.post('/votacao/interna/confirmacao', confirmarVoto)

// Rota POST para verificar o voto
router.post('/votacao/interna/confirmacao/validacao', conferirVoto)

export default router
