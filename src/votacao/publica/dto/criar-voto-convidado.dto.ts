import { IsInt, IsNotEmpty } from 'class-validator';

export class CriarVotoConvidadoDto {
  @IsInt()
  @IsNotEmpty()
  idVisitante: number; // Convidado que está votando

  @IsInt()
  @IsNotEmpty()
  idProjeto: number; // Projeto que está recebendo o voto

  @IsInt()
  @IsNotEmpty()
  idEvento: number; // Evento em que a votação está ocorrendo
}
