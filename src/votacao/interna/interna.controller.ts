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
   * Registra o voto de um aluno em um candidato dentro de um evento específico.
   */
  @Post('confirmacao')
  @ApiOperation({ summary: 'Registrar voto do aluno' })
  @ApiBody({
    description: 'Dados necessários para registrar um voto',
    type: CriarVotoDto,
  })
  @ApiResponse({ status: 201, description: 'Voto registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação nos dados enviados.' })
  async votar(@Body() body: CriarVotoDto) {
    const { idAluno, idCandidato, idEvento } = body;

    if (!idAluno || !idCandidato || !idEvento) {
      throw new BadRequestException('Todos os campos são obrigatórios.');
    }

    return this.internaService.votar(idAluno, idCandidato, idEvento);
  }

  /**
   * Verifica se um aluno já votou em um determinado evento.
   */
  @Get('confirmacao/verificacao')
  @ApiOperation({ summary: 'Verificar se o aluno já votou' })
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

    return this.internaService.verificarVoto(idAluno, idEvento);
  }
}
