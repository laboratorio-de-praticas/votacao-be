/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { InternaService } from './interna.service';
import { CriarVotoDto } from './dto/criar-voto.dto';
import { VerificarVotoDto } from './dto/verificar-voto.dto';

@ApiTags('Votação Interna')
@Controller('votacao/interna')
export class InternaController {
  constructor(private readonly internaService: InternaService) {}

  /**
   * Registra o voto de um aluno em um representante dentro de um evento específico.
   */
  @Post('confirmacao')
  @ApiOperation({ summary: 'Registrar voto do aluno em um representante' })
  @ApiBody({
    description: 'Dados necessários para registrar um voto',
    type: CriarVotoDto,
  })
  @ApiResponse({ status: 201, description: 'Voto registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação nos dados enviados.' })
  async votar(@Body() body: CriarVotoDto) {
    const { idAluno, idRepresentante, idEvento } = body;

    if (!idAluno || !idRepresentante || !idEvento) {
      throw new BadRequestException('Todos os campos são obrigatórios.');
    }

    return this.internaService.votarEmRepresentante(idAluno, idRepresentante, idEvento);
  }

  /**
   * Verifica se um aluno está apto a votar em um determinado evento interno.
   */
  @Get('confirmacao/verificacao')
  @ApiOperation({ summary: 'Verificar se o aluno já votou no evento' })
  @ApiQuery({
    name: 'idAluno',
    description: 'ID do aluno para verificar se já votou',
    example: 123,
    required: true,
  })
  @ApiQuery({
    name: 'idEvento',
    description: 'ID do evento para verificar se pode votar',
    example: 456,
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Status do voto retornado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Parâmetros obrigatórios ausentes ou inválidos.' })
  async verificarVoto(@Query() query: VerificarVotoDto) {
    const { idAluno, idEvento } = query;

    if (!idAluno || !idEvento) {
      throw new BadRequestException('Os parâmetros idAluno e idEvento são obrigatórios.');
    }

    return this.internaService.verificarVotoEmEvento(idAluno, idEvento);
  }
}
