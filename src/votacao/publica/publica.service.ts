/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicaService {
  constructor(private readonly prisma: PrismaService) {}

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
    });

    if (!evento || evento.status_evento !== 'Ativo') {
      throw new BadRequestException('A votação não está aberta neste momento.');
    }

    if (evento.tipo_evento === 'Interno') {
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
      },
    });

    return { message: 'Voto do avaliador registrado com sucesso!' };
  }

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
          include: {
            categoria: true,
          },
        },
      },
    });

    if (!projeto) {
      throw new NotFoundException('Projeto não encontrado.');
    }

    return projeto;
  }

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
      },
    });

    return { message: 'Classificação registrada com sucesso!' };
  }
}