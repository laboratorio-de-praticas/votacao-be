import { IsInt, IsNotEmpty } from 'class-validator';

export class CriarVotoAvaliadorDto {
  @IsInt()
  @IsNotEmpty()
  idAvaliador: number; // Avaliador que está votando

  @IsInt()
  @IsNotEmpty()
  idProjeto: number; // Projeto que está recebendo o voto

  @IsInt()
  @IsNotEmpty()
  idEvento: number; // Evento em que a votação está ocorrendo
}
