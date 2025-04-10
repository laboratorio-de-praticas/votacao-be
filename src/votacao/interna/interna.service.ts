<<<<<<< HEAD
import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
=======
import { Injectable, BadRequestException } from '@nestjs/common';
>>>>>>> origin/develop
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InternaService {
  constructor(private readonly prisma: PrismaService) {}

<<<<<<< HEAD
  async votar(id_aluno: number, id_representante: number, id_evento: number) {
    // Verificar se o evento existe e está ativo
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento: id_evento },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    // Verificar período de votação
    const agora = new Date();
    if (!evento.data_inicio || !evento.data_fim) {
      throw new BadRequestException('Período de votação não definido para este evento.');
    }

    if (agora < evento.data_inicio) {
      throw new BadRequestException('A votação ainda não começou.');
    }

    if (agora > evento.data_fim) {
      throw new BadRequestException('A votação já encerrou.');
    }

    // Verificar se o aluno existe
    const aluno = await this.prisma.aluno.findUnique({
      where: { id_aluno: id_aluno },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado.');
    }

    // Verificar se o representante existe e pertence ao evento
    const representante = await this.prisma.representante.findUnique({
      where: { id_representante: id_representante },
      include: { evento: true }
    });

    if (!representante) {
      throw new NotFoundException('Representante não encontrado.');
    }

    if (representante.fk_id_evento !== id_evento) {
      throw new BadRequestException('Este representante não pertence ao evento especificado.');
    }

    // Verificar se o aluno já votou neste evento
    const votoExistente = await this.prisma.votoInterno.findFirst({
      where: { 
        fk_id_aluno: id_aluno,
        fk_id_evento: id_evento
      }
    });

    if (votoExistente) {
      throw new ConflictException('Você já votou neste evento.');
    }

    // Registrar o voto
    try {
      await this.prisma.votoInterno.create({
        data: {
          fk_id_aluno: id_aluno,
          fk_id_representante: id_representante,
          fk_id_evento: id_evento
        }
      });

      return { 
        success: true,
        message: 'Voto registrado com sucesso!' 
      };
    } catch (error) {
      throw new BadRequestException('Erro ao registrar voto: ' + error.message);
    }
=======
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
>>>>>>> origin/develop
  }

  async verificarVoto(id_aluno: number, id_evento: number) {
    // Verificar se o aluno existe
    const aluno = await this.prisma.aluno.findUnique({
<<<<<<< HEAD
      where: { id_aluno: id_aluno },
    });

    if (!aluno) {
      throw new NotFoundException('Aluno não encontrado.');
=======
      where: { id_aluno },
    });

    if (!aluno) {
      throw new BadRequestException('Aluno não encontrado.');
>>>>>>> origin/develop
    }

    // Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
<<<<<<< HEAD
      where: { id_evento: id_evento },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    // Verificar se o aluno já votou
    const voto = await this.prisma.votoInterno.findFirst({
      where: { 
        fk_id_aluno: id_aluno,
        fk_id_evento: id_evento
      },
      include: {
        representante: {
          include: {
            aluno: {
              include: {
                usuario: true
              }
            }
          }
        }
      }
    });

    return {
      jaVotou: !!voto,
      votoInfo: voto ? {
        representante: {
          id: voto.representante.id_representante,
          nome: voto.representante.aluno.usuario.nome
        },
        dataVoto: voto.data_criacao
      } : null,
      message: voto ? 'Você já votou neste evento.' : 'Você ainda não votou neste evento.'
    };
  }
}
=======
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
>>>>>>> origin/develop
