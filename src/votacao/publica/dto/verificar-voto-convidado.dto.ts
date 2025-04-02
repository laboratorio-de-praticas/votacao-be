import { IsInt, IsNotEmpty } from 'class-validator';

export class VerificarVotoConvidadoDto {
  @IsInt()
  @IsNotEmpty()
  idVisitante: number; // Convidado para verificar se já votou

  @IsInt()
  @IsNotEmpty()
  idProjeto: number; // Projeto no qual verificar se já votou

  @IsInt()
  @IsNotEmpty()
  idEvento: number; // Evento no qual verificar se ele pode votar
}
