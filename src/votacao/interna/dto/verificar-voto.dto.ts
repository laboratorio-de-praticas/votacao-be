import { IsInt, IsNotEmpty } from 'class-validator';

export class VerificarVotoDto {
  @IsInt()
  @IsNotEmpty()
  idAluno: number; // Aluno para verificar se já votou

  @IsInt()
  @IsNotEmpty()
  idEvento: number; // Evento no qual verificar se ele pode votar
}
