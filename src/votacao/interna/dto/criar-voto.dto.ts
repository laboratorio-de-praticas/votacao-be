import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CriarVotoDto {
  @ApiProperty({ description: 'ID do aluno que está votando', example: 1 })
  @IsInt()
  @IsNotEmpty()
  idAluno: number;

  @ApiProperty({
    description: 'ID do candidato que está recebendo o voto',
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  idCandidato: number;

  @ApiProperty({
    description: 'ID do evento em que a votação está ocorrendo',
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  idEvento: number;
}
