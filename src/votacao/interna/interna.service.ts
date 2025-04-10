import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class InternaService {
  constructor(private readonly prisma: PrismaService) {}

  async votar(idAluno: number, idRepresentante: number, idEvento: number): Promise<{ message: string }> {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento: idEvento },
    });

    if (!evento || evento.tipo_evento !== 'Interno') {
      throw new BadRequestException('Evento inválido ou não é do tipo interno.');
    }

    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: idAluno },
    });

    if (!aluno) {
      throw new BadRequestException('Aluno não encontrado.');
    }

    const representante = await this.prisma.representante.findUnique({
      where: { id_representante: idRepresentante },
      include: {
        aluno: true,
      },
    });

    if (!representante) {
      throw new BadRequestException('Representante não encontrado.');
    }

    if (
      aluno.curso_semestre !== representante.aluno.curso_semestre &&
      aluno.id_aluno !== representante.aluno.id_aluno
    ) {
      throw new BadRequestException('Você só pode votar em representantes da sua turma.');
    }

    const votoExistente = await this.prisma.votoInterno.findFirst({
      where: {
        fk_id_aluno: idAluno,
        fk_id_evento: idEvento,
      },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    await this.prisma.votoInterno.create({
      data: {
        fk_id_evento: idEvento,
        fk_id_representante: idRepresentante,
        fk_id_aluno: idAluno,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarVoto(idAluno: number, idEvento: number) {
    const voto = await this.prisma.votoInterno.findFirst({
      where: {
        fk_id_aluno: idAluno,
        fk_id_evento: idEvento,
      },
    });

    return {
      idAluno,
      idEvento,
      votoConfirmado: !!voto,
      message: voto ? 'Aluno já votou neste evento.' : 'Aluno apto a votar.',
    };
  }
}
