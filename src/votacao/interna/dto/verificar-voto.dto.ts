import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class VerificarVotoDto {
  @ApiProperty({
    description: 'ID do aluno para verificar se já votou',
    example: 123,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  idAluno: number

  @ApiProperty({
    description: 'ID do evento no qual verificar se ele pode votar',
    example: 789,
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  idEvento: number;
}
