// routes/votacaoPublicaRoute.js
import express from 'express'
const router = express.Router();
import getHome, { registrarVotoConvidado } from '../controllers/votacaoPublicaController.js'

router.get('/', getHome);
router.post('/votacao/publica/convidados/confirmacao', registrarVotoConvidado);

export default router;