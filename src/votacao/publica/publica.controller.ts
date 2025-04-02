/* eslint-disable prettier/prettier */
import { 
  Controller, Post, Get, Body, Param, BadRequestException, ParseIntPipe 
} from '@nestjs/common';
import { PublicaService } from './publica.service';

@Controller('votacao/publica/confirmacao')
export class PublicaController {
  constructor(private readonly publicaService: PublicaService) {}

  @Post('convidado')
  async votarConvidado(@Body() body: { id_visitante: number; id_candidato: number; id_evento: number }) {
    const { id_visitante, id_candidato, id_evento } = body;

    if (!id_visitante || !id_candidato || !id_evento) {
      throw new BadRequestException('Todos os campos (id_visitante, id_candidato, id_evento) são obrigatórios.');
    }

    if (isNaN(id_visitante) || isNaN(id_candidato) || isNaN(id_evento)) {
      throw new BadRequestException('Os IDs fornecidos devem ser números.');
    }

    return this.publicaService.votarConvidado(id_visitante, id_candidato, id_evento);
  }

  @Get('convidado/verificacao/:id_visitante/:id_evento')
  async verificarConvidado(
    @Param('id_visitante', ParseIntPipe) id_visitante: number, 
    @Param('id_evento', ParseIntPipe) id_evento: number
  ) {
    if (id_visitante <= 0 || id_evento <= 0) {
      throw new BadRequestException('Os IDs fornecidos devem ser números positivos.');
    }

    return this.publicaService.verificarConvidado(id_visitante, id_evento);
  }

  @Post('avaliador')
  async votarAvaliador(@Body() body: { id_avaliador: number; id_candidato: number; id_evento: number }) {
    const { id_avaliador, id_candidato, id_evento } = body;

    if (!id_avaliador || !id_candidato || !id_evento) {
      throw new BadRequestException('Todos os campos (id_avaliador, id_candidato, id_evento) são obrigatórios.');
    }

    if (isNaN(id_avaliador) || isNaN(id_candidato) || isNaN(id_evento)) {
      throw new BadRequestException('Os IDs fornecidos devem ser números.');
    }

    return this.publicaService.votarAvaliador(id_avaliador, id_candidato, id_evento);
  }

  @Get('avaliador/verificacao/:id_avaliador/:id_evento')
  async verificarAvaliador(
    @Param('id_avaliador', ParseIntPipe) id_avaliador: number, 
    @Param('id_evento', ParseIntPipe) id_evento: number
  ) {
    if (id_avaliador <= 0 || id_evento <= 0) {
      throw new BadRequestException('Os IDs fornecidos devem ser números positivos.');
    }

    return this.publicaService.verificarAvaliador(id_avaliador, id_evento);
  }
}
