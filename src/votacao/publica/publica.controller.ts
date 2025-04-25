import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { PublicaService } from './publica.service';
@ApiTags('Votação Pública')
@Controller('votacao/publica/confirmacao')
export class PublicaController {
  constructor(private readonly publicaService: PublicaService) {}

  /**
   * Registra o voto do visitante em um projeto específico dentro do evento.
   */
  @Post('visitante')
  @ApiOperation({ summary: 'Registrar voto do visitante' })
  @ApiBody({
    description: 'Dados necessários para registrar um voto',
    schema: {
      type: 'object',
      properties: {
        id_visitante: { type: 'number', example: 1 },
        id_projeto: { type: 'number', example: 10 },
        id_evento: { type: 'number', example: 100 },
      },
      required: ['id_visitante', 'id_projeto', 'id_evento'],
    },
  })
  @ApiResponse({ status: 201, description: 'Voto registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro na validação dos dados.' })
  async votarVisitante(
    @Body('id_visitante') id_visitante: number,
    @Body('id_projeto') id_projeto: number,
    @Body('id_evento') id_evento: number,
  ) {
    return this.publicaService.votarVisitante(
      id_visitante,
      id_projeto,
      id_evento,
    );
  }

  /**
   * Verifica se um visitante pode votar em um evento específico.
   */
  @Get('visitante/:idVisitante/:idProjeto/:idEvento')
  @ApiOperation({ summary: 'Verificar se o visitante pode votar no evento' })
  @ApiParam({ name: 'idVisitante', description: 'ID do visitante', example: 1 })
  @ApiParam({ name: 'idProjeto', description: 'ID do projeto', example: 10 })
  @ApiParam({ name: 'idEvento', description: 'ID do evento', example: 100 })
  @ApiResponse({
    status: 200,
    description: 'Status do voto retornado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros obrigatórios ausentes ou inválidos.',
  })
  async verificarVisitante(
    @Param('idVisitante') idVisitante: number,
    @Param('idProjeto') idProjeto: number,
    @Param('idEvento') idEvento: number,
  ) {
    if (!idVisitante || !idProjeto || !idEvento) {
      throw new BadRequestException('Todos os parâmetros são obrigatórios.');
    }

    return this.publicaService.verificarVisitante(
      idVisitante,
      idEvento,
      idProjeto,
    );
  }

  /**
   * Obtém os detalhes de um projeto específico, exibindo informações relevantes e botão de votação.
   */
  @Get('avaliador/:id_projeto')
  @ApiOperation({ summary: 'Obter detalhes de um projeto' })
  @ApiParam({ name: 'id_projeto', required: true, example: 1 })
  async detalhesProjeto(@Param('id_projeto') id_projeto: number) {
    // Use @Param
    if (!id_projeto) {
      throw new BadRequestException('O ID do projeto é obrigatório.');
    }
    return this.publicaService.detalhesProjeto(id_projeto);
  }

  /**
   * Permite que um avaliador registre uma classificação de estrelas para um projeto.
   */
  @Post('avaliador/classificacao')
  @ApiOperation({ summary: 'Registrar classificação de um projeto' })
  @ApiBody({
    description: 'Dados necessários para registrar a classificação',
    schema: {
      type: 'object',
      properties: {
        id_avaliador: { type: 'number', example: 2 },
        id_projeto: { type: 'number', example: 2 },
        estrelas_inovador: {
          type: 'number',
          minimum: 1,
          maximum: 5,
          example: 4,
        },
        estrelas_acolhedor: {
          type: 'number',
          minimum: 1,
          maximum: 5,
          example: 4,
        },
      },
      required: [
        'id_avaliador',
        'id_projeto',
        'estrelas_inovador',
        'estrelas_acolhedor',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Classificação registrada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Erro na validação dos dados.' })
  async classificarProjeto(
    @Body('id_avaliador') id_avaliador: number,
    @Body('id_projeto') id_projeto: number,
    @Body('estrelas_inovador') estrelas_inovador: number,
    @Body('estrelas_acolhedor') estrelas_acolhedor: number,
  ) {
					return await this.publicaService.classificarProjeto(
									id_avaliador,
									id_projeto,
									estrelas_inovador,
									estrelas_acolhedor,
					);
  }

  /**
   * Verifica se um avaliador pode votar em um evento específico.
   */
  @Get('avaliador/:idAvaliador/:idProjeto/:idEvento')
  @ApiOperation({ summary: 'Verificar se o avaliador pode votar no evento' })
  @ApiParam({ name: 'idAvaliador', description: 'ID do avaliador', example: 2 })
  @ApiParam({ name: 'idProjeto', description: 'ID do projeto', example: 10 })
  @ApiParam({ name: 'idEvento', description: 'ID do evento', example: 100 })
  @ApiResponse({
    status: 200,
    description: 'Status do voto retornado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros obrigatórios ausentes ou inválidos.',
  })
  async verificarAvaliador(
    @Param('idAvaliador') idAvaliador: number,
    @Param('idProjeto') idProjeto: number,
    @Param('idEvento') idEvento: number,
  ) {
    if (!idAvaliador || !idProjeto || !idEvento) {
      throw new BadRequestException('Todos os parâmetros são obrigatórios.');
    }

    return this.publicaService.verificarAvaliador(
      idAvaliador,
      idEvento,
      idProjeto,
    );
  }
}
