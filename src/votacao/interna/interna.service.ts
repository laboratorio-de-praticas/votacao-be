import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternaService {
  constructor(private readonly prisma: PrismaService) {}

  async votarEmRepresentante(
    id_aluno: number,
    id_representante: number,
    id_evento: number,
  ) {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (
      !evento ||
      !evento.data_inicio ||
      !evento.data_fim ||
      evento.tipo_evento !== 'Interno'
    ) {
      throw new BadRequestException('Evento inválido.');
    }

    const agora = new Date();
    if (agora < evento.data_inicio || agora > evento.data_fim) {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
      include: { usuario: true },
    });

    if (!aluno || aluno.usuario.status_usuario !== 'Ativo') {
      throw new BadRequestException('Aluno não encontrado ou inativo.');
    }

    const representante = await this.prisma.representante.findUnique({
      where: { id_representante },
      include: {
        aluno: true,
        evento: true,
      },
    });

    if (!representante) {
      throw new BadRequestException('Representante não encontrado.');
    }

    if (representante.fk_id_evento !== id_evento) {
      throw new BadRequestException(
        'Representante não pertence ao evento informado.',
      );
    }

    const votoExistente = await this.prisma.votoInterno.findUnique({
      where: {
        fk_id_evento_fk_id_aluno: {
          fk_id_evento: id_evento,
          fk_id_aluno: id_aluno,
        },
      },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    if (aluno.curso_semestre !== evento.curso_semestre) {
      throw new BadRequestException(
        'Aluno não pertence ao curso/semestre do evento.',
      );
    }

    await this.prisma.votoInterno.create({
      data: {
        fk_id_aluno: id_aluno,
        fk_id_representante: id_representante,
        fk_id_evento: id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarVotoEmEvento(id_aluno: number, id_evento: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
      include: { usuario: true },
    });

    if (!aluno || aluno.usuario.status_usuario !== 'Ativo') {
      throw new BadRequestException('Aluno não encontrado ou inativo.');
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (
      !evento ||
      !evento.data_inicio ||
      !evento.data_fim ||
      evento.tipo_evento !== 'Interno'
    ) {
      throw new BadRequestException('Evento inválido.');
    }

    const agora = new Date();
    if (agora < evento.data_inicio || agora > evento.data_fim) {
      throw new BadRequestException('O evento não está em andamento.');
    }

    if (aluno.curso_semestre !== evento.curso_semestre) {
      throw new BadRequestException(
        'Aluno não pertence ao curso/semestre do evento.',
      );
    }

    const voto = await this.prisma.votoInterno.findUnique({
      where: {
        fk_id_evento_fk_id_aluno: {
          fk_id_evento: id_evento,
          fk_id_aluno: id_aluno,
        },
      },
    });

    return {
      id_aluno,
      id_evento,
      voto_confirmado: !!voto,
      message: voto ? 'Aluno já votou neste evento.' : 'Aluno apto a votar.',
    };
  }
}
