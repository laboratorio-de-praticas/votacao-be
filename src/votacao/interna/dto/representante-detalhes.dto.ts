import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUrl, IsOptional, IsEnum } from 'class-validator';
import { RepresentanteSituacao } from '@prisma/client';

export class RepresentanteResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID único do representante',
  })
  @IsInt()
  id_representante: number;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do representante',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    example: '/fotos/joao.jpg',
    description: 'URL da foto do representante',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  foto_url?: string;

  @ApiProperty({
    example: 'DSM5',
    description: 'Curso e semestre do representante',
  })
  @IsString()
  curso_semestre: string;

  @ApiProperty({
    example: 'Vote em mim para melhorar nossa turma!',
    description: 'Descrição da campanha',
    required: false,
  })
  @IsString()
  @IsOptional()
  descricao_campanha?: string;

  @ApiProperty({
    example: 'Ativo',
    description: 'Situação do representante',
    enum: ['Pendente', 'Ativo', 'Desligado'],
  })
  @IsEnum(['Pendente', 'Ativo', 'Desligado'])
  situacao: RepresentanteSituacao;

  @ApiProperty({
    example: 'http://localhost:3000/qrcode/1',
    description: 'URL do QRCode para votação',
  })
  @IsUrl()
  qrcode: string;
}
