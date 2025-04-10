import {  Controller,  Post,  Get,  Body,  Query,  BadRequestException,} from '@nestjs/common';
import {  ApiTags,  ApiOperation,  ApiBody,  ApiQuery,  ApiResponse,} from '@nestjs/swagger';
import { InternaService } from './interna.service';
import { CriarVotoDto } from './dto/criar-voto.dto';
import { VerificarVotoDto } from './dto/verificar-voto.dto';

@ApiTags('Votacao Interna')
@Controller('votacao/interna')
export class InternaController {
  constructor(private readonly internaService: InternaService) {}

  @Post('confirmacao')
  @ApiOperation({ summary: 'Registrar voto do aluno' })
  @ApiBody({ type: CriarVotoDto })
  @ApiResponse({ status: 201, description: 'Voto registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro de validação nos dados enviados.' })
  async votar(@Body() body: CriarVotoDto): Promise<{ message: string }> {
    const { idAluno, idRepresentante, idEvento } = body

    if (!idAluno || !idRepresentante || !idEvento) {
      throw new BadRequestException('Todos os campos são obrigatórios.');
    }

    return this.internaService.votar(idAluno, idRepresentante, idEvento);
  }

  @Get('confirmacao/verificacao')
  @ApiOperation({ summary: 'Verificar se o aluno já votou' })
  @ApiQuery({ name: 'idAluno', required: true })
  @ApiQuery({ name: 'idEvento', required: true })
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