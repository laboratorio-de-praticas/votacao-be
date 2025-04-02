/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Query, Body, BadRequestException } from '@nestjs/common';
import { InternaService } from './interna.service';

@Controller('votacao/interna')
export class InternaController {
  constructor(private readonly internaService: InternaService) {}

  @Post('confirmacao')
  async votar(@Body() body: { id_aluno: number; id_candidato: number; id_evento: number }) {
    const { id_aluno, id_candidato, id_evento } = body;

    if (!id_aluno || !id_candidato || !id_evento) {
      throw new BadRequestException('Todos os campos são obrigatórios.');
    }

    return this.internaService.votar(id_aluno, id_candidato, id_evento);
  }

  @Get('confirmacao/verificacao')
  async verificarVoto(@Query('id_aluno') id_aluno: number, @Query('id_evento') id_evento: number) {
    if (!id_aluno || !id_evento) {
      throw new BadRequestException('Os parâmetros id_aluno e id_evento são obrigatórios.');
    }

    return this.internaService.verificarVoto(id_aluno, id_evento);
  }
}
