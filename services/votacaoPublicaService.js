// services/votacaoPublicaService.js
import { registrarVotoConvidado } from '../models/VotoPublicoConvidado.js';

const getWelcomeMessage = () => {
  return 'Backend está rodando!';
};

export const registrarVotoPublico = async (votoData) => {
  try {
    const resultado = await registrarVotoConvidado(votoData);
    return resultado;
  } catch (error) {
    console.error('Erro ao registrar voto público:', error);
    throw error;
  }
};

export default getWelcomeMessage;