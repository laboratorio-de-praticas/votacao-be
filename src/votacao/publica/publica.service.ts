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
      throw new BadRequestException(
        'Convidados não podem votar em eventos internos.',
      );
    }

    const visitante = await this.prisma.visitante.findUnique({
      where: { id_visitante },
      select: { id_visitante: true },
    });

    if (!visitante) {
      throw new BadRequestException('Visitante não encontrado.');
    }

    const projeto = await this.prisma.projeto.findFirst({
      where: { id_projeto: id_candidato },
      select: { id_projeto: true }
    });

    if(!projeto) {
      throw new BadRequestException('Projeto não encontrado');
    }

    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
	      fk_id_projeto: projeto.id_projeto,
	      fk_id_visitante: visitante.id_visitante
      },
      select: { id_voto: true },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    await this.prisma.votoExterno.create({
      data: {
        fk_id_projeto: projeto.id_projeto,
        fk_id_visitante: visitante.id_visitante,
        fk_id_evento: id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarConvidado(
    id_visitante: number,
    id_evento: number,
    id_candidato: number
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
        'Convidados não podem votar em eventos internos.',
      );
    }

    const visitante = await this.prisma.visitante.findUnique({
      where: { id_visitante },
      select: { id_visitante: true },
    });

    if (!visitante) {
      throw new BadRequestException('Visitante não encontrado.');
    }

    const projeto = await this.prisma.projeto.findFirst({
	where: { id_projeto: id_candidato },
	select: { id_projeto: true }
    });

    if(!projeto) {
	throw new BadRequestException('Projeto não encontrado');
    }

    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
	      fk_id_projeto: projeto.id_projeto,
	      fk_id_visitante: visitante.id_visitante
      },
      select: { id_voto: true },
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
        'Avalidor não podem votar em eventos internos.',
      );
    }

    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador },
      select: { id_avaliador: true },
    });

    if (!avaliador) {
      throw new BadRequestException('Avaliador não encontrado.');
    }

    const projeto = await this.prisma.projeto.findFirst({
	where: { id_projeto: id_candidato },
	select: { id_projeto: true }
    });

    if(!projeto) {
	throw new BadRequestException('Projeto não encontrado');
    }

    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
	      fk_id_projeto: projeto.id_projeto,
	      fk_id_visitante: avaliador.id_avaliador
      },
      select: { id_voto: true },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    await this.prisma.votoExterno.create({
      data: {
        fk_id_projeto: projeto.id_projeto,
        fk_id_visitante: avaliador.id_avaliador,
        fk_id_evento: id_evento,
      },
    });

    return { message: 'Voto do avaliador registrado com sucesso!' };
  }

  async verificarAvaliador(
    id_avaliador: number,
    id_evento: number,
    id_candidato: number
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
        'Avaliador não podem votar em eventos internos.',
      );
    }

    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador },
      select: { id_avaliador: true },
    });

    if (!avaliador) {
      throw new BadRequestException('Avaliador não encontrado.');
    }

    const projeto = await this.prisma.projeto.findFirst({
	where: { id_projeto: id_candidato },
	select: { id_projeto: true }
    });

    if(!projeto) {
	throw new BadRequestException('Projeto não encontrado');
    }

    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
	      fk_id_projeto: projeto.id_projeto,
	      fk_id_avaliador: avaliador.id_avaliador
      },
      select: { id_voto: true },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    return { message: 'Avaliador apto a votar.' };
  }

  async detalhesProjeto(id_projeto: number) {
    const projeto = await this.prisma.projeto.findFirst({
      where: { id_projeto },
      	include: {
	      aluno: true
      	}
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
    estrelas_acolhedor: number
  ): Promise<{ message: string }> {
    if (estrelas_inovador < 1 || estrelas_inovador > 5) {
      throw new BadRequestException(
        'A classificação deve estar entre 1 e 5 estrelas.',
      );
    }
    if (estrelas_acolhedor < 1 || estrelas_acolhedor > 5) {
      throw new BadRequestException(
        'A classificação deve estar entre 1 e 5 estrelas.',
      );
    }

    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador: idAvaliador },
      select: { id_avaliador: true },
    });

    if (!avaliador?.id_avaliador) {
      throw new BadRequestException(
        'Avaliador não encontrado ou não autorizado.',
      );
    }

    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto: idProjeto },
      select: { id_projeto: true },
    });

    if (!projeto) {
      throw new BadRequestException('Projeto não encontrado.');
    }

    const classificacaoExistente = await this.prisma.avaliacao.findFirst({
      where: {
          fk_id_avaliador: idAvaliador,
          fk_id_projeto: idProjeto,
      },
      select: { id_avaliacao: true },
    });

    if (classificacaoExistente) {
      throw new BadRequestException('Você já avaliou este projeto.');
    }

    await this.prisma.avaliacao.create({
      data: {
        fk_id_avaliador: idAvaliador,
        fk_id_projeto: idProjeto,
        estrelas_inovador,
	estrelas_acolhedor
      },
    });

    return { message: 'Classificação registrada com sucesso!' };
  }
}
