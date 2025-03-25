import getWelcomeMessage from '../services/votacaoPublicaService.js'

const getHome = (req, res) => {
  try {
    const message = getWelcomeMessage();
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send('Erro ao processar requisição');
  }
};

export default getHome