import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternaService {
  constructor(private readonly prisma: PrismaService) {}

<<<<<<< HEAD
  async votar(id_aluno: number, id_representante: number, id_evento: number) {
    const evento = await this.prisma.evento.findUnique({ where: { id_evento } });

    if (!evento || !evento.data_inicio || !evento.data_fim) {
      throw new BadRequestException('Evento inválido.');
    }

    const agora = new Date();
    if (agora < evento.data_inicio) {
      throw new BadRequestException('A votação ainda não começou.');
    }
    if (agora > evento.data_fim) {
      throw new BadRequestException('A votação foi encerrada.');
    }

    if (evento.tipo_evento !== 'Interno') {
      throw new BadRequestException('Só é permitido votar em eventos do tipo Interno.');
    }

    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
      include: { usuario: true },
=======
  async votar(idAluno: number, idRepresentante: number, idEvento: number): Promise<{ message: string }> {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento: idEvento },
    });

    if (!evento || evento.tipo_evento !== 'Interno') {
      throw new BadRequestException('Evento inválido ou não é do tipo interno.');
    }

    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: idAluno },
>>>>>>> c12f34f (fix: Correção no Schema e no código em relação as regras de negócio)
    });

    if (!aluno || !aluno.usuario) {
      throw new BadRequestException('Aluno não cadastrado.');
    }

<<<<<<< HEAD
    const votoExistente = await this.prisma.votoInterno.findFirst({
      where: {
        fk_id_evento: id_evento,
        fk_id_aluno: id_aluno,
=======
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
>>>>>>> c12f34f (fix: Correção no Schema e no código em relação as regras de negócio)
      },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

<<<<<<< HEAD
    const representante = await this.prisma.representante.findUnique({
      where: { id_representante },
      include: { aluno: true, evento: true },
    });

    if (!representante || representante.fk_id_evento !== id_evento) {
      throw new BadRequestException('Representante inválido ou não pertence a este evento.');
    }

    if (aluno.curso_semestre !== representante.aluno.curso_semestre) {
      throw new BadRequestException('Você só pode votar em representantes da sua sala.');
    }

    await this.prisma.votoInterno.create({
      data: {
        fk_id_evento: id_evento,
        fk_id_aluno: id_aluno,
        fk_id_representante: id_representante,
=======
    await this.prisma.votoInterno.create({
      data: {
        fk_id_evento: idEvento,
        fk_id_representante: idRepresentante,
        fk_id_aluno: idAluno,
>>>>>>> c12f34f (fix: Correção no Schema e no código em relação as regras de negócio)
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }
<<<<<<< HEAD
=======

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
>>>>>>> c12f34f (fix: Correção no Schema e no código em relação as regras de negócio)
}
