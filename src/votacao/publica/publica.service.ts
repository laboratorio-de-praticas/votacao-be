/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicaService {
  constructor(private readonly prisma: PrismaService) {}

  async votarConvidado(
    id_visitante: number,
    id_candidatos: number[],
    id_evento: number,
  ): Promise<{ message: string; votos: number[] }> {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
      select: {
        tipo_evento: true,
        status_evento: true,
        data_inicio: true,
        data_fim: true,
      },
    });

    if (!evento || evento.status_evento !== 'Ativo' || evento.tipo_evento !== 'Externo') {
      throw new BadRequestException('O evento não está disponível neste momento.');
    }

    const now = new Date();
    if (evento.data_inicio <= now || evento.data_fim >= now) {
      throw new BadRequestException('O evento está ativo neste momento.');
    }

    const agora = new Date();
    if (agora < evento.data_inicio || agora > evento.data_fim) {
    throw new BadRequestException('O evento não está ativo neste momento.');
    }

    const visitante = await this.prisma.visitante.findUnique({
      where: { id_visitante },
      select: { id_visitante: true },
    });

    if (!visitante) {
      throw new BadRequestException('Visitante não encontrado.');
    }

    let participante = await this.prisma.participante.findFirst({
      where: { id_visitante, id_evento },
      select: { id_participante: true },
    });

    if (!participante) {
      participante = await this.prisma.participante.create({
        data: { id_visitante, id_evento },
        select: { id_participante: true },
      });
    }

    const votosRegistrados: number[] = [];

    for (const id_candidato of id_candidatos) {
      const votoExistente = await this.prisma.votoExterno.findFirst({
        where: {
          id_participante: participante.id_participante,
          id_candidato,
          id_evento,
        },
      });

      if (votoExistente) continue;

      const participacao = await this.prisma.projeto.findFirst({
        where: {
          id_projeto: id_candidato,
            participantes: {
              some: { id_visitante },
          },
        },
      });

      if (participacao) continue;

      const votoExterno = await this.prisma.votoExterno.create({
        data: {
          id_participante: participante.id_participante,
          id_candidato,
          id_evento,
        },
        select: { id_voto: true },
      });

      votosRegistrados.push(votoExterno.id_voto);
    }

    if (votosRegistrados.length === 0) {
      throw new BadRequestException('Nenhum voto foi registrado. Você pode já ter votado ou participado de algum dos projetos selecionados.');
    }

    return {
      message: 'Votos registrados com sucesso!',
      votos: votosRegistrados,
    };
  }

  async verificarConvidado(
    id_visitante: number,
    id_evento: number,
  ): Promise<{ message: string }> {
    const participante = await this.prisma.participante.findFirst({
      where: { id_visitante, id_evento },
      select: { id_participante: true },
    });

    if (participante) {
      const votoExistente = await this.prisma.votoExterno.findFirst({
        where: {
          id_participante: participante.id_participante,
          id_evento,
        },
        select: { id_voto: true },
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
  ): Promise<{ message: string }> {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
      select: { tipo_evento: true, status_evento: true },
    });

    if (!evento || evento.status_evento !== 'Ativo') {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    if (evento.tipo_evento === 'Interno') {
      throw new BadRequestException('Avaliadores não podem votar em eventos internos.');
    }

    const avaliador = await this.prisma.participante.findUnique({
      where: { id_participante: id_avaliador },
      select: { avaliador: true },
    });

    if (!avaliador?.avaliador) {
      throw new BadRequestException('Avaliador não encontrado ou não autorizado.');
    }

    const votoExistente = await this.prisma.voto.findFirst({
      where: {
        id_participante: id_avaliador,
        id_candidato,
      },
      select: { id_voto: true },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste projeto.');
    }

    await this.prisma.votoExterno.create({
      data: {
        fk_id_evento: id_evento,
        fk_id_projeto: id_projeto,
        fk_id_visitante: id_visitante,
      },
    });

    return { message: 'Voto do avaliador registrado com sucesso!' };
  }

  async verificarAvaliador(
    id_avaliador: number,
    id_evento: number,
  ): Promise<{ message: string }> {
    const votoExistente = await this.prisma.voto.findFirst({
      where: {
        id_participante: id_avaliador,
        id_evento,
      },
      select: { id_voto: true },
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
          include: { aluno: true },
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
  ): Promise<{ message: string }> {
    if (estrelas < 1 || estrelas > 5) {
      throw new BadRequestException('A classificação deve estar entre 1 e 5 estrelas.');
    }

    const avaliador = await this.prisma.participante.findUnique({
      where: { id_participante: idAvaliador },
      select: { avaliador: true },
    });

    if (!avaliador?.avaliador) {
      throw new BadRequestException('Avaliador não encontrado ou não autorizado.');
    }

    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto: idProjeto },
      select: { id_projeto: true },
    });

    if (!projeto) {
      throw new BadRequestException('Projeto não encontrado.');
    }

    const classificacaoExistente = await this.prisma.classificacao.findUnique({
      where: {
        id_participante_id_projeto: {
          id_participante: idAvaliador,
          id_projeto: idProjeto,
        },
      },
      select: { id_classificacao: true },
    });

    if (classificacaoExistente) {
      throw new BadRequestException('Você já avaliou este projeto.');
    }

    await this.prisma.classificacao.create({
      data: {
        id_participante: idAvaliador,
        id_projeto: idProjeto,
        estrelas,
      },
    });

    return { message: 'Classificação registrada com sucesso!' };
  }
}
