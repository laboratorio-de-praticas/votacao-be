import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicaService {
  constructor(private readonly prisma: PrismaService) {}

  async votarConvidado(
    id_visitante: number,
    id_candidato: number,
    id_evento: number,
  ) {
    // Verificar se o evento está ativo dentro do período
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });
    if (!evento || !evento.data_inicio || !evento.data_fim) {
      throw new BadRequestException('Evento inválido.');
    }
    const agora = new Date();
    if (agora < evento.data_inicio || agora > evento.data_fim) {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    // Verificar se o visitante existe
    const visitante = await this.prisma.visitante.findUnique({
      where: { id_visitante },
    });
    if (!visitante) {
      throw new BadRequestException('Visitante não encontrado.');
    }

    // Verificar se o visitante já votou nesse candidato
    const votoExistente = await this.prisma.voto.findFirst({
      where: { id_participante: id_visitante, id_candidato },
    });
    if (votoExistente) {
      throw new BadRequestException('Você já votou neste candidato.');
    }

    // Registrar o voto
    await this.prisma.voto.create({
      data: {
        id_participante: id_visitante,
        id_candidato,
        id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarConvidado(id_visitante: number, id_evento: number) {
    // Verificar se o visitante já votou no evento
    const votoExistente = await this.prisma.voto.findFirst({
      where: { id_participante: id_visitante, id_evento },
    });
    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }
    return { message: 'Convidado apto a votar.' };
  }

  async votarAvaliador(
    id_avaliador: number,
    id_candidato: number,
    id_evento: number,
  ) {
    // Verificar se o evento está ativo dentro do período
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });
    if (!evento || !evento.data_inicio || !evento.data_fim) {
      throw new BadRequestException('Evento inválido.');
    }
    const agora = new Date();
    if (agora < evento.data_inicio || agora > evento.data_fim) {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    // Verificar se o avaliador existe
    const avaliador = await this.prisma.participante.findUnique({
      where: { id_participante: id_avaliador },
    });
    if (!avaliador || !avaliador.avaliador) {
      throw new BadRequestException(
        'Avaliador não encontrado ou não autorizado.',
      );
    }

    // Registrar o voto
    await this.prisma.voto.create({
      data: {
        id_participante: id_avaliador,
        id_candidato,
        id_evento,
      },
    });

    return { message: 'Voto do avaliador registrado com sucesso!' };
  }

  async verificarAvaliador(id_avaliador: number, id_evento: number) {
    // Verificar se o avaliador já votou no evento
    const votoExistente = await this.prisma.voto.findFirst({
      where: { id_participante: id_avaliador, id_evento },
    });
    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }
    return { message: 'Avaliador apto a votar.' };
  }
}
