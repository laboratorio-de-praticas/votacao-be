// /* eslint-disable prettier/prettier */
// import { Controller, Post, Get, Body, Query } from '@nestjs/common';
// import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
// import { PublicaService } from './publica.service';

// @ApiTags('Votação Pública')
// @Controller('votacao/publica/confirmacao')
// export class PublicaController {
//   constructor(private readonly publicaService: PublicaService) {}

//   /**
//    * Registra o voto do convidado em um candidato específico dentro do evento.
//    */
//   @Post('convidado')
//   @ApiOperation({ summary: 'Registrar voto do convidado' })
//   @ApiBody({
//     description: 'Dados necessários para registrar um voto',
//     schema: {
//       type: 'object',
//       properties: {
//         id_visitante: { type: 'number', example: 1 },
//         id_candidato: { type: 'number', example: 10 },
//         id_evento: { type: 'number', example: 100 },
//       },
//       required: ['id_visitante', 'id_candidato', 'id_evento'],
//     },
//   })
//   @ApiResponse({ status: 201, description: 'Voto registrado com sucesso.' })
//   @ApiResponse({ status: 400, description: 'Erro na validação dos dados.' })
//   async votarConvidado(
//     @Body('id_visitante') id_visitante: number,
//     @Body('id_candidato') id_candidato: number,
//     @Body('id_evento') id_evento: number,
//   ) {
//     return this.publicaService.votarConvidado(
//       id_visitante,
//       id_candidato,
//       id_evento,
//     );
//   }

//   /**
//    * Verifica se o convidado pode votar no evento.
//    */
//   @Get('convidado/verificacao')
//   @ApiOperation({ summary: 'Verificar se o convidado pode votar' })
//   @ApiQuery({ name: 'id_visitante', required: true, example: 1 })
//   @ApiQuery({ name: 'id_evento', required: true, example: 100 })
//   @ApiResponse({ status: 200, description: 'Status da elegibilidade do convidado.' })
//   @ApiResponse({ status: 400, description: 'Parâmetros inválidos ou ausentes.' })
//   async verificarConvidado(
//     @Query('id_visitante') id_visitante: number,
//     @Query('id_evento') id_evento: number,
//   ) {
//     return this.publicaService.verificarConvidado(id_visitante, id_evento);
//   }

//   /**
//    * Obtém os detalhes de um projeto específico, exibindo informações relevantes e botão de votação.
//    */
//   @Get('avaliador')
//   @ApiOperation({ summary: 'Obter detalhes de um projeto' })
//   @ApiQuery({ name: 'id_projeto', required: true, example: 200 })
//   @ApiResponse({ status: 200, description: 'Detalhes do projeto retornados com sucesso.' })
//   @ApiResponse({ status: 404, description: 'Projeto não encontrado.' })
//   async detalhesProjeto(@Query('id_projeto') id_projeto: number) {
//     return this.publicaService.detalhesProjeto(id_projeto);
//   }

//   /**
//    * Permite que um avaliador registre uma classificação de estrelas para um projeto.
//    */
//   @Post('avaliador/classificacao')
//   @ApiOperation({ summary: 'Registrar classificação de um projeto' })
//   @ApiBody({
//     description: 'Dados necessários para registrar a classificação',
//     schema: {
//       type: 'object',
//       properties: {
//         id_avaliador: { type: 'number', example: 2 },
//         id_projeto: { type: 'number', example: 200 },
//         estrelas: { type: 'number', minimum: 1, maximum: 5, example: 4 },
//       },
//       required: ['id_avaliador', 'id_projeto', 'estrelas'],
//     },
//   })
//   @ApiResponse({ status: 201, description: 'Classificação registrada com sucesso.' })
//   @ApiResponse({ status: 400, description: 'Erro na validação dos dados.' })
//   async classificarProjeto(
//     @Body('id_avaliador') id_avaliador: number,
//     @Body('id_projeto') id_projeto: number,
//     @Body('estrelas') estrelas: number,
//   ) {
//     return this.publicaService.classificarProjeto(
//       id_avaliador,
//       id_projeto,
//       estrelas,
//     );
//   }

//   /**
//    * Verifica se um avaliador está apto a votar em um evento.
//    */
//   @Get('avaliador/verificacao')
//   @ApiOperation({ summary: 'Verificar se o avaliador pode votar' })
//   @ApiQuery({ name: 'id_avaliador', required: true, example: 2 })
//   @ApiQuery({ name: 'id_evento', required: true, example: 100 })
//   @ApiResponse({ status: 200, description: 'Status da elegibilidade do avaliador.' })
//   @ApiResponse({ status: 400, description: 'Parâmetros inválidos ou ausentes.' })
//   async verificarAvaliador(
//     @Query('id_avaliador') id_avaliador: number,
//     @Query('id_evento') id_evento: number,
//   ) {
//     return this.publicaService.verificarAvaliador(id_avaliador, id_evento);
//   }
// }

