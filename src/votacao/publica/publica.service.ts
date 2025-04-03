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
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });
    if (!evento || evento.status_evento !== 'Ativo') {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    const visitante = await this.prisma.visitante.findUnique({
      where: { id_visitante },
    });
    if (!visitante) {
      throw new BadRequestException('Visitante não encontrado.');
    }

    // Verifica se o visitante já tem um registro de participante
    let participante = await this.prisma.participante.findFirst({
      where: { id_visitante, id_evento },
    });

    // Se o visitante ainda não é um participante, criamos um
    if (!participante) {
      participante = await this.prisma.participante.create({
        data: {
          id_visitante,
          id_evento,
        },
      });
    }

    // Verificar se já votou nesse candidato
    const votoExistente = await this.prisma.voto.findFirst({
      where: { id_participante: participante.id_participante, id_candidato },
    });
    if (votoExistente) {
      throw new BadRequestException('Você já votou neste candidato.');
    }

    // Registrar o voto
    await this.prisma.voto.create({
      data: {
        id_participante: participante.id_participante,
        id_candidato,
        id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarConvidado(id_visitante: number, id_evento: number) {
    const participante = await this.prisma.participante.findFirst({
      where: { id_visitante, id_evento },
    });

    if (participante) {
      const votoExistente = await this.prisma.voto.findFirst({
        where: { id_participante: participante.id_participante, id_evento },
      });
      if (votoExistente) {
        throw new BadRequestException('Você já votou neste evento.');
      }
    }

    return { message: 'Convidado apto a votar.' };
  }

  async votarAvaliador(
    id_avaliador: number,
    id_candidato: number,
    id_evento: number,
  ) {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });
    if (!evento || evento.status_evento !== 'Ativo') {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    const avaliador = await this.prisma.participante.findUnique({
      where: { id_participante: id_avaliador },
    });
    if (!avaliador || !avaliador.avaliador) {
      throw new BadRequestException(
        'Avaliador não encontrado ou não autorizado.',
      );
    }

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
    const votoExistente = await this.prisma.voto.findFirst({
      where: { id_participante: id_avaliador, id_evento },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    return { message: 'Avaliador apto a votar.' };
  }

  async detalhesProjeto(id_projeto: number) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto },
      include: {
        candidatos: {
          include: {
            aluno: true,
          },
        },
      },
    });

    if (!projeto) {
      throw new BadRequestException('Projeto não encontrado.');
    }

    return projeto;
  }

  async classificarProjeto(
    idAvaliador: number,
    idProjeto: number,
    estrelas: number,
  ) {
    if (estrelas < 1 || estrelas > 5) {
      throw new BadRequestException(
        'A classificação deve estar entre 1 e 5 estrelas.',
      );
    }

    const avaliador = await this.prisma.participante.findUnique({
      where: { id_participante: idAvaliador },
    });

    if (!avaliador || !avaliador.avaliador) {
      throw new BadRequestException(
        'Avaliador não encontrado ou não autorizado.',
      );
    }

    await this.prisma.projeto.update({
      where: { id_projeto: idProjeto },
      data: {
        descricao: `Avaliação de ${estrelas} estrelas`,
      },
    });

    return { message: 'Classificação registrada com sucesso!' };
  }
}
