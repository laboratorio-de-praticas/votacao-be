import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternaService {
  constructor(private readonly prisma: PrismaService) {}

  async votar(id_aluno: number, id_candidato: number, id_evento: number) {
    const agora = new Date();

    // 1. Verificar se o evento existe e está ativo
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (!evento) {
      throw new BadRequestException('Evento não encontrado.');
    }

    if (evento.tipo_evento !== 'Interno') {
      throw new BadRequestException('Só é permitido votar em eventos do tipo Interno.');
    }

    if (evento.status_evento !== 'Ativo') {
      throw new BadRequestException('Este evento não está ativo para votação.');
    }

    if (!evento.data_inicio || agora < evento.data_inicio) {
      throw new BadRequestException('A votação ainda não começou.');
    }

    if (!evento.data_fim || agora > evento.data_fim) {
      throw new BadRequestException('O período de votação já terminou.');
    }

    // 2. Verificar se o aluno existe
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
    });

    if (!aluno) {
      throw new BadRequestException('Aluno não encontrado.');
    }

    // 3. Verificar se o candidato existe e pertence ao evento
    const candidato = await this.prisma.candidato.findUnique({
      where: { id: id_candidato },
      include: { aluno: true },
    });

    if (!candidato) {
      throw new BadRequestException('Candidato não encontrado.');
    }

    if (candidato.id_evento !== id_evento) {
      throw new BadRequestException('Candidato não pertence a este evento.');
    }

    // 4. Verificar se aluno e candidato têm o mesmo curso_semestre
    if (aluno.curso_semestre !== candidato.aluno.curso_semestre) {
      throw new BadRequestException('Você só pode votar em candidatos do mesmo curso e semestre.');
    }

    // 5. Buscar participação do aluno no evento
    const participante = await this.prisma.participante.findFirst({
      where: {
        id_aluno: id_aluno,
        id_evento: id_evento,
      },
    });

    if (!participante) {
      throw new BadRequestException('Participação do aluno não encontrada.');
    }

    // 6. Verificar se já existe voto neste evento
    const votoExistente = await this.prisma.voto.findFirst({
      where: {
        id_participante: participante.id_participante,
        id_evento,
      },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste evento.');
    }

    // 7. Verificar se já votou neste candidato
    const votoDuplicado = await this.prisma.voto.findFirst({
      where: {
        id_participante: participante.id_participante,
        id_candidato: id_candidato,
      },
    });

    if (votoDuplicado) {
      throw new BadRequestException('Você já votou neste candidato.');
    }

    // 8. Criar o voto
    await this.prisma.voto.create({
      data: {
        id_participante: participante.id_participante,
        id_candidato,
        id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async verificarVoto(id_aluno: number, id_evento: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno },
    });

    if (!aluno) {
      throw new BadRequestException('Aluno não encontrado.');
    }

    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (!evento) {
      throw new BadRequestException('Evento não encontrado.');
    }

    const participante = await this.prisma.participante.findFirst({
      where: {
        id_aluno,
        id_evento,
      },
    });

    if (!participante) {
      throw new BadRequestException('Participação do aluno não encontrada.');
    }

    const voto = await this.prisma.voto.findFirst({
      where: {
        id_participante: participante.id_participante,
        id_evento,
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
