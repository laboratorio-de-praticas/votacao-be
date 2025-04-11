/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
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
   * Verifica se o visitante pode votar no evento.
   */
  @Get('visitante/verificacao')
  @ApiOperation({ summary: 'Verificar se o visitante pode votar' })
  @ApiQuery({ name: 'id_visitante', required: true, example: 1 })
  @ApiQuery({ name: 'id_evento', required: true, example: 100 })
  @ApiQuery({ name: 'id_projeto', required: true, example: 10 })
  @ApiResponse({ status: 200, description: 'Status da elegibilidade do visitante.' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos ou ausentes.' })
  async verificarVisitante(
    @Query('id_visitante') id_visitante: number,
    @Query('id_evento') id_evento: number,
    @Query('id_projeto') id_projeto: number,
  ) {
    return this.publicaService.verificarVisitante(id_visitante, id_evento, id_projeto);
  }

  /**
   * Obtém os detalhes de um projeto específico, exibindo informações relevantes e botão de votação.
   */
  @Get('avaliador')
  @ApiOperation({ summary: 'Obter detalhes de um projeto' })
  @ApiQuery({ name: 'id_projeto', required: true, example: 200 })
  @ApiResponse({ status: 200, description: 'Detalhes do projeto retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
  async detalhesProjeto(@Query('id_projeto') id_projeto: number) {
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
        id_projeto: { type: 'number', example: 200 },
        estrelas_inovador: { type: 'number', minimum: 1, maximum: 5, example: 4 },
        estrelas_acolhedor: { type: 'number', minimum: 1, maximum: 5, example: 4 },
      },
      required: ['id_avaliador', 'id_projeto', 'estrelas_inovador', 'estrelas_acolhedor'],
    },
  })
  @ApiResponse({ status: 201, description: 'Classificação registrada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro na validação dos dados.' })
  async classificarProjeto(
    @Body('id_avaliador') id_avaliador: number,
    @Body('id_projeto') id_projeto: number,
    @Body('estrelas_inovador') estrelas_inovador: number,
    @Body('estrelas_acolhedor') estrelas_acolhedor: number,
  ) {
    return this.publicaService.classificarProjeto(
      id_avaliador,
      id_projeto,
      estrelas_inovador,
      estrelas_acolhedor,
    );
  }

  /**
   * Verifica se um avaliador está apto a votar em um evento.
   */
  @Get('avaliador/verificacao')
  @ApiOperation({ summary: 'Verificar se o avaliador pode votar' })
  @ApiQuery({ name: 'id_avaliador', required: true, example: 2 })
  @ApiQuery({ name: 'id_evento', required: true, example: 100 })
  @ApiQuery({ name: 'id_projeto', required: true, example: 10 })
  @ApiResponse({ status: 200, description: 'Status da elegibilidade do avaliador.' })
  @ApiResponse({ status: 400, description: 'Parâmetros inválidos ou ausentes.' })
  async verificarAvaliador(
    @Query('id_avaliador') id_avaliador: number,
    @Query('id_evento') id_evento: number,
    @Query('id_projeto') id_projeto: number,
  ) {
    return this.publicaService.verificarAvaliador(id_avaliador, id_evento, id_projeto);
  }
}
