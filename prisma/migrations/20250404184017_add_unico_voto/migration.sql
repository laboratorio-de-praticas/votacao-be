/*
  Warnings:

  - A unique constraint covering the columns `[id_participante,id_candidato]` on the table `Voto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Voto_id_participante_id_candidato_key" ON "Voto"("id_participante", "id_candidato");
