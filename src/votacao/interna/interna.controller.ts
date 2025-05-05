import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  Param,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
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
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos dados enviados.',
  })
  async votar(@Body() body: CriarVotoDto) {
    const { idAluno, idRepresentante, idEvento } = body;

    if (!idAluno || !idRepresentante || !idEvento) {
      throw new BadRequestException('Todos os campos são obrigatórios.');
    }

    return this.internaService.votarEmRepresentante(
      idAluno,
      idRepresentante,
      idEvento,
    );
  }

  /**
   * Verifica se um aluno está apto a votar em um determinado evento interno.
   */
  @Get('confirmacao/verificacao/:idAluno/:idEvento')
  @ApiOperation({
    summary: 'Verificar se o aluno já votou no evento (via URL)',
  })
  @ApiParam({ name: 'idAluno', description: 'ID do aluno', example: 123 })
  @ApiParam({ name: 'idEvento', description: 'ID do evento', example: 456 })
  @ApiResponse({
    status: 200,
    description: 'Status do voto retornado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros obrigatórios ausentes ou inválidos.',
  })
  async verificarVotoPorParams(
    @Param(new ValidationPipe({ transform: true })) params: VerificarVotoDto,
  ) {
    const { idAluno, idEvento } = params;
    return this.internaService.verificarVotoEmEvento(idAluno, idEvento);
  }

  /**
   * Obtém os detalhes completos de um representante
   */
  @Get('representante/:id_representante')
  @ApiOperation({
    summary: 'Obter detalhes de um representante',
    description:
      'Retorna informações básicas como nome, foto, curso e situação do representante',
  })
  @ApiParam({
    name: 'id_representante',
    description: 'ID numérico do representante',
    example: 1,
  })
  async detalhesRepresentante(
    @Param('id_representante', ParseIntPipe) id_representante: number,
  ) {
    return this.internaService.detalhesRepresentante(id_representante);
  }
}
