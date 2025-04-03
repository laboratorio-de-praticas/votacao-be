import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CriarVotoConvidadoDto {
  @ApiProperty({
    description: 'ID do visitante que está votando',
    example: 444,
  })
  @IsInt()
  @IsNotEmpty()
  idVisitante: number;

  @ApiProperty({
    description: 'ID do projeto que está recebendo o voto',
    example: 555,
  })
  @IsInt()
  @IsNotEmpty()
  idProjeto: number;

  @ApiProperty({
    description: 'ID do evento em que a votação está ocorrendo',
    example: 666,
  })
  @IsInt()
  @IsNotEmpty()
  idEvento: number;
}
