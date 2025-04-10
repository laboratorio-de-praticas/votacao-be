/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
<<<<<<< HEAD
import { Injectable, BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
=======
import { Injectable, BadRequestException } from '@nestjs/common';
>>>>>>> origin/develop
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicaService {
  constructor(private readonly prisma: PrismaService) {}

<<<<<<< HEAD
  async verificarConvidado(chave_acesso: string, id_evento: number) {
    // 1. Verificar se a chave de acesso existe
    const visitante = await this.prisma.visitante.findFirst({
      where: { chave_acesso },
    });

    if (!visitante) {
      throw new NotFoundException('Chave de acesso não encontrada');
    }

    // 2. Verificar se o evento existe
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
    });

    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (evento.tipo_evento !== 'Externo') {
      throw new BadRequestException('Este evento não é público');
    }
  
    // 3. Verificar período
    const agora = new Date();
    if (!evento.data_inicio || !evento.data_fim || 
        agora < evento.data_inicio || agora > evento.data_fim) {
      throw new BadRequestException('Evento não está em andamento');
    }
    
    // 3. Verificar se o visitante já votou neste evento
    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
        fk_id_visitante: visitante.id_visitante,
        fk_id_evento: id_evento,
      },
    });

    return {
      podeVotar: !votoExistente,
      mensagem: votoExistente ? 'Visitante já votou neste evento' : 'Pode votar',
      id_visitante: visitante.id_visitante,
    };
  }

  async votarConvidado(chave_acesso: string, id_projeto: number, id_evento: number) {
    // 1. Verificar elegibilidade
    const verificacao = await this.verificarConvidado(chave_acesso, id_evento);
    
    if (!verificacao.podeVotar) {
      throw new ConflictException(verificacao.mensagem);
    }

    // 2. Verificar se o projeto existe e pertence ao evento
    const projeto = await this.prisma.projeto.findFirst({
      where: {
        id_projeto,
        votosExternos: {
          some: {
            fk_id_evento: id_evento,
          },
        },
      },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado para este evento');
    }

    // 3. Registrar o voto
    await this.prisma.votoExterno.create({
      data: {
        fk_id_visitante: verificacao.id_visitante,
        fk_id_projeto: id_projeto,
        fk_id_evento: id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
  }

  async votarAvaliador(id_avaliador: number, id_projeto: number, id_evento: number) {
    // 1. Verificar se o evento existe e está ativo
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
=======
  async votarConvidado(
    id_visitante: number,
    id_candidato: number,
    id_evento: number,
  ): Promise<{ message: string }> {
    const evento = await this.prisma.evento.findUnique({
      where: { id_evento },
      select: { tipo_evento: true, status_evento: true },
>>>>>>> origin/develop
    });

    if (!evento || evento.status_evento !== 'Ativo') {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    if (evento.tipo_evento === 'Interno') {
<<<<<<< HEAD
      throw new BadRequestException('Avaliadores não podem votar em eventos internos.');
    }

    // 2. Verificar se o avaliador existe
    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador },
    });

    if (!avaliador) {
      throw new NotFoundException('Avaliador não encontrado.');
    }

    // 3. Verificar se o projeto existe
    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    // 4. Verificar se o avaliador já votou neste projeto
    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
        fk_id_avaliador: id_avaliador,
        fk_id_projeto: id_projeto,
      },
    });

    if (votoExistente) {
      throw new ConflictException('Você já votou neste projeto.');
    }

    // 5. Registrar o voto
    await this.prisma.votoExterno.create({
      data: {
        fk_id_avaliador: id_avaliador,
        fk_id_projeto: id_projeto,
        fk_id_evento: id_evento,
=======
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

    const votoExistente = await this.prisma.voto.findFirst({
      where: {
        id_participante: participante.id_participante,
        id_candidato,
      },
      select: { id_voto: true },
    });

    if (votoExistente) {
      throw new BadRequestException('Você já votou neste projeto.');
    }

    await this.prisma.voto.create({
      data: {
        id_participante: participante.id_participante,
        id_candidato,
        id_evento,
      },
    });

    return { message: 'Voto registrado com sucesso!' };
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
      const votoExistente = await this.prisma.voto.findFirst({
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
      throw new BadRequestException(
        'Avaliadores não podem votar em eventos internos.',
      );
    }

    const avaliador = await this.prisma.participante.findUnique({
      where: { id_participante: id_avaliador },
      select: { avaliador: true },
    });

    if (!avaliador?.avaliador) {
      throw new BadRequestException(
        'Avaliador não encontrado ou não autorizado.',
      );
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

    await this.prisma.voto.create({
      data: {
        id_participante: id_avaliador,
        id_candidato,
        id_evento,
>>>>>>> origin/develop
      },
    });

    return { message: 'Voto do avaliador registrado com sucesso!' };
  }

<<<<<<< HEAD
  async verificarAvaliador(id_avaliador: number, id_evento: number) {
    // 1. Verificar se o avaliador já votou neste evento
    const votoExistente = await this.prisma.votoExterno.findFirst({
      where: {
        fk_id_avaliador: id_avaliador,
        fk_id_evento: id_evento,
      },
    });

    if (votoExistente) {
      throw new ConflictException('Você já votou neste evento.');
=======
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
>>>>>>> origin/develop
    }

    return { message: 'Avaliador apto a votar.' };
  }

  async detalhesProjeto(id_projeto: number) {
    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto },
      include: {
<<<<<<< HEAD
        aluno: {
          include: {
            usuario: true,
          },
        },
        categorias: {
          include: {
            categoria: true,
          },
=======
        candidatos: {
          include: { aluno: true },
>>>>>>> origin/develop
        },
      },
    });

    if (!projeto) {
<<<<<<< HEAD
      throw new NotFoundException('Projeto não encontrado.');
=======
      throw new BadRequestException('Projeto não encontrado.');
>>>>>>> origin/develop
    }

    return projeto;
  }

<<<<<<< HEAD
  async classificarProjeto(id_avaliador: number, id_projeto: number, estrelas: number) {
    // 1. Validação das estrelas
    if (estrelas < 1 || estrelas > 5) {
      throw new BadRequestException('A classificação deve estar entre 1 e 5 estrelas.');
    }

    // 2. Verificar se o avaliador existe
    const avaliador = await this.prisma.avaliador.findUnique({
      where: { id_avaliador },
    });

    if (!avaliador) {
      throw new NotFoundException('Avaliador não encontrado.');
    }

    // 3. Verificar se o projeto existe
    const projeto = await this.prisma.projeto.findUnique({
      where: { id_projeto },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    // 4. Verificar se já existe avaliação
    const avaliacaoExistente = await this.prisma.avaliacao.findFirst({
      where: {
        fk_id_avaliador: id_avaliador,
        fk_id_projeto: id_projeto,
      },
    });

    if (avaliacaoExistente) {
      throw new ConflictException('Você já avaliou este projeto.');
    }

    // 5. Registrar a avaliação
    await this.prisma.avaliacao.create({
      data: {
        fk_id_avaliador: id_avaliador,
        fk_id_projeto: id_projeto,
        estrelas_inovador: estrelas,
        estrelas_acolhedor: estrelas,
=======
  async classificarProjeto(
    idAvaliador: number,
    idProjeto: number,
    estrelas: number,
  ): Promise<{ message: string }> {
    if (estrelas < 1 || estrelas > 5) {
      throw new BadRequestException(
        'A classificação deve estar entre 1 e 5 estrelas.',
      );
    }

    const avaliador = await this.prisma.participante.findUnique({
      where: { id_participante: idAvaliador },
      select: { avaliador: true },
    });

    if (!avaliador?.avaliador) {
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
>>>>>>> origin/develop
      },
    });

    return { message: 'Classificação registrada com sucesso!' };
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/develop
