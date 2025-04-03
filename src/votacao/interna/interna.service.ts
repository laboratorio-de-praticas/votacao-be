import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternaService {
  constructor(private readonly prisma: PrismaService) {}

  async votar(id_aluno: number, id_candidato: number, id_evento: number) {
    // Verificar se o evento está ativo
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

    // Verificar se o aluno e o candidato existem
    const [aluno, candidato] = await Promise.all([
      this.prisma.aluno.findUnique({ where: { id_aluno } }),
      this.prisma.aluno.findUnique({ where: { id_aluno: id_candidato } }),
    ]);

    if (!aluno) {
      throw new BadRequestException('Aluno não encontrado.');
    }

    if (!candidato) {
      throw new BadRequestException('Candidato inválido.');
    }

    // Verificar se o aluno já votou
    const votoExistente = await this.prisma.voto.findFirst({
      where: { id_participante: id_aluno, id_evento },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    // Verificar se o candidato pertence à mesma sala do aluno
    if (aluno.curso_semestre !== candidato.curso_semestre) {
      throw new BadRequestException(
        'Você só pode votar em candidatos do mesmo curso e semestre.',
      );
    }

    // Registrar o voto
    await this.prisma.voto.create({
      data: {
        id_participante: id_aluno,
        id_candidato,
        id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarVoto(id_aluno: number, id_evento: number) {
    // Verificar se o aluno existe
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
    });

    if (!aluno) {
      throw new BadRequestException('Aluno não encontrado.');
    }

    // Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (!evento) {
      throw new BadRequestException('Evento não encontrado.');
    }

    // Verificar se o aluno já votou no evento
    const voto = await this.prisma.voto.findFirst({
      where: { id_participante: id_aluno, id_evento },
    });

    return {
      id_aluno,
      id_evento,
      voto_confirmado: !!voto,
      message: voto ? 'Aluno já votou neste evento.' : 'Aluno apto a votar.',
    };
  }
}
