import express from 'express'
const router = express.Router();
import getHome from '../controllers/votacaoPublicaController.js'

router.get('/', getHome);

export default router;