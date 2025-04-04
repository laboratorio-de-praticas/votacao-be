-- CreateTable
CREATE TABLE "Classificacao" (
    "id_classificacao" SERIAL NOT NULL,
    "id_participante" INTEGER NOT NULL,
    "id_projeto" INTEGER NOT NULL,
    "estrelas" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classificacao_pkey" PRIMARY KEY ("id_classificacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Classificacao_id_participante_id_projeto_key" ON "Classificacao"("id_participante", "id_projeto");

-- AddForeignKey
ALTER TABLE "Classificacao" ADD CONSTRAINT "Classificacao_id_participante_fkey" FOREIGN KEY ("id_participante") REFERENCES "Participante"("id_participante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classificacao" ADD CONSTRAINT "Classificacao_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto"("id_projeto") ON DELETE RESTRICT ON UPDATE CASCADE;
