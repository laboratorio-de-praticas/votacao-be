import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicaService {
  constructor(private readonly prisma: PrismaService) {}

  async votarVisitante(
    id_visitante: number,
    id_projeto: number,
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
      throw new BadRequestException(
        'Visitantes não podem votar em eventos internos.',
      );
    }

    const visitante = await this.prisma.visitante.findUnique({
      where: { id_visitante },
    });

    if (!visitante) {
      throw new BadRequestException('Visitante não encontrado.');
    }

    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto },
    });

    if (!projeto) {
      throw new BadRequestException('Projeto não encontrado.');
    }

    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
        fk_id_evento: id_evento,
        fk_id_projeto: id_projeto,
        fk_id_visitante: id_visitante,
      },
    });

    if (votoExistente) {
      throw new BadRequestException(
        'Você já votou neste projeto neste evento.',
      );
    }

    await this.prisma.votoExterno.create({
      data: {
        fk_id_evento: id_evento,
        fk_id_projeto: id_projeto,
        fk_id_visitante: id_visitante,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarVisitante(
    id_visitante: number,
    id_evento: number,
    id_projeto: number,
  ): Promise<{ message: string }> {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (!evento || evento.status_evento !== 'Ativo') {
      throw new BadRequestException('O evento não está ativo.');
    }

    if (evento.tipo_evento !== 'Externo') {
      throw new BadRequestException('Este evento não é público.');
    }

    const visitante = await this.prisma.visitante.findUnique({
      where: { id_visitante },
    });

    if (!visitante) {
      throw new BadRequestException('Visitante não encontrado.');
    }

    const voto = await this.prisma.votoExterno.findFirst({
      where: {
        fk_id_evento: id_evento,
        fk_id_projeto: id_projeto,
        fk_id_visitante: id_visitante,
      },
    });

    if (voto) {
      throw new BadRequestException('Você já votou neste projeto.');
    }

    return { message: 'Visitante apto a votar.' };
  }

  async votarAvaliador(
    id_avaliador: number,
    id_projeto: number,
    id_evento: number,
  ): Promise<{ message: string }> {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (!evento || evento.status_evento !== 'Ativo') {
      throw new BadRequestException('O evento não está ativo.');
    }

    if (evento.tipo_evento !== 'Externo') {
      throw new BadRequestException(
        'Avaliadores não podem votar em eventos internos.',
      );
    }

    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador },
    });

    if (!avaliador) {
      throw new BadRequestException('Avaliador não encontrado.');
    }

    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto },
    });

    if (!projeto) {
      throw new BadRequestException('Projeto não encontrado.');
    }

    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
        fk_id_evento: id_evento,
        fk_id_projeto: id_projeto,
        fk_id_avaliador: id_avaliador,
      },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste projeto.');
    }

    await this.prisma.votoExterno.create({
      data: {
        fk_id_evento: id_evento,
        fk_id_projeto: id_projeto,
        fk_id_avaliador: id_avaliador,
      },
    });

    return { message: 'Voto do avaliador registrado com sucesso!' };
  }

  async verificarAvaliador(
    id_avaliador: number,
    id_evento: number,
    id_projeto: number,
  ): Promise<{ message: string }> {
    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador },
    });

    if (!avaliador) {
      throw new BadRequestException('Avaliador não encontrado.');
    }

    const voto = await this.prisma.votoExterno.findFirst({
      where: {
        fk_id_evento: id_evento,
        fk_id_projeto: id_projeto,
        fk_id_avaliador: id_avaliador,
      },
    });

    if (voto) {
      throw new BadRequestException('Você já votou neste projeto.');
    }

    return { message: 'Avaliador apto a votar.' };
  }

  async detalhesProjeto(id_projeto: number) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto },
      include: {
        aluno: {
          include: {
            usuario: true,
          },
        },
        categorias: {
          include: { categoria: true },
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
    estrelas_inovador: number,
    estrelas_acolhedor: number,
  ): Promise<{ message: string }> {
    if (
      estrelas_inovador < 1 ||
      estrelas_inovador > 5 ||
      estrelas_acolhedor < 1 ||
      estrelas_acolhedor > 5
    ) {
      throw new BadRequestException(
        'As classificações devem estar entre 1 e 5 estrelas.',
      );
    }

    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador: idAvaliador },
    });

    if (!avaliador) {
      throw new BadRequestException('Avaliador não encontrado.');
    }

    const avaliacaoExistente = await this.prisma.avaliacao.findFirst({
      where: {
        fk_id_avaliador: idAvaliador,
        fk_id_projeto: idProjeto,
      },
    });

    if (avaliacaoExistente) {
      throw new BadRequestException('Você já avaliou este projeto.');
    }

    await this.prisma.avaliacao.create({
      data: {
        fk_id_avaliador: idAvaliador,
        fk_id_projeto: idProjeto,
        estrelas_inovador,
        estrelas_acolhedor,
      },
    });

    return { message: 'Classificação registrada com sucesso!' };
  }
}
