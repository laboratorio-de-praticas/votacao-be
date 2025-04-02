import { IsInt, IsNotEmpty } from 'class-validator';

export class CriarVotoDto {
  @IsInt()
  @IsNotEmpty()
  idAluno: number; // Aluno que está votando

  @IsInt()
  @IsNotEmpty()
  idCandidato: number; // Representante da sala que está recebendo o voto

  @IsInt()
  @IsNotEmpty()
  idEvento: number; // Evento em que a votação está ocorrendo
}
