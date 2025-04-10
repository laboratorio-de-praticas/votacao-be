/*
  Warnings:

  - You are about to drop the column `data_ingresso` on the `Aluno` table. All the data in the column will be lost.
  - You are about to drop the column `celular` on the `Visitante` table. All the data in the column will be lost.
  - You are about to drop the column `data_nascimento` on the `Visitante` table. All the data in the column will be lost.
  - You are about to drop the column `nome_social` on the `Visitante` table. All the data in the column will be lost.
  - You are about to drop the `Candidato` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoriasProjeto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classificacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FotoProjeto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Voto` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fk_id_usuario]` on the table `Aluno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_institucional]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fk_id_aluno` to the `Projeto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RepresentanteSituacao" AS ENUM ('Pendente', 'Ativo', 'Desligado');

-- AlterEnum
ALTER TYPE "UsuarioTipos" ADD VALUE 'Interno';

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_id_aluno_fkey";

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_id_projeto_fkey";

-- DropForeignKey
ALTER TABLE "CategoriasProjeto" DROP CONSTRAINT "CategoriasProjeto_fk_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "CategoriasProjeto" DROP CONSTRAINT "CategoriasProjeto_fk_id_projeto_fkey";

-- DropForeignKey
ALTER TABLE "Classificacao" DROP CONSTRAINT "Classificacao_id_participante_fkey";

-- DropForeignKey
ALTER TABLE "Classificacao" DROP CONSTRAINT "Classificacao_id_projeto_fkey";

-- DropForeignKey
ALTER TABLE "FotoProjeto" DROP CONSTRAINT "FotoProjeto_fk_id_projeto_fkey";

-- DropForeignKey
ALTER TABLE "Participante" DROP CONSTRAINT "Participante_id_aluno_fkey";

-- DropForeignKey
ALTER TABLE "Participante" DROP CONSTRAINT "Participante_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Participante" DROP CONSTRAINT "Participante_id_visitante_fkey";

-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_id_candidato_fkey";

-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "Voto" DROP CONSTRAINT "Voto_id_participante_fkey";

-- AlterTable
ALTER TABLE "Aluno" DROP COLUMN "data_ingresso",
ADD COLUMN     "data_matricula" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Projeto" ADD COLUMN     "fk_id_aluno" INTEGER NOT NULL,
ADD COLUMN     "foto_url" TEXT,
ADD COLUMN     "qrcode" TEXT;

-- AlterTable
ALTER TABLE "Visitante" DROP COLUMN "celular",
DROP COLUMN "data_nascimento",
DROP COLUMN "nome_social",
ADD COLUMN     "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nome" TEXT,
ADD COLUMN     "telefone" TEXT;

-- DropTable
DROP TABLE "Candidato";

-- DropTable
DROP TABLE "CategoriasProjeto";

-- DropTable
DROP TABLE "Classificacao";

-- DropTable
DROP TABLE "FotoProjeto";

-- DropTable
DROP TABLE "Participante";

-- DropTable
DROP TABLE "Voto";

-- DropEnum
DROP TYPE "CandidatoSituacao";

-- CreateTable
CREATE TABLE "Avaliador" (
    "id_avaliador" SERIAL NOT NULL,
    "fk_id_usuario" INTEGER NOT NULL,
    "nome" TEXT,
    "telefone" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliador_pkey" PRIMARY KEY ("id_avaliador")
);

-- CreateTable
CREATE TABLE "CategoriasProjetos" (
    "id" SERIAL NOT NULL,
    "fk_id_projeto" INTEGER NOT NULL,
    "fk_id_categoria" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriasProjetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representante" (
    "id_representante" SERIAL NOT NULL,
    "fk_id_aluno" INTEGER NOT NULL,
    "fk_id_evento" INTEGER NOT NULL,
    "qrcode" TEXT,
    "RepresentanteSituacao" "RepresentanteSituacao" NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Representante_pkey" PRIMARY KEY ("id_representante")
);

-- CreateTable
CREATE TABLE "VotoInterno" (
    "id_voto" SERIAL NOT NULL,
    "fk_id_evento" INTEGER NOT NULL,
    "fk_id_aluno" INTEGER NOT NULL,
    "fk_id_representante" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VotoInterno_pkey" PRIMARY KEY ("id_voto")
);

-- CreateTable
CREATE TABLE "VotoExterno" (
    "id_voto" SERIAL NOT NULL,
    "fk_id_evento" INTEGER NOT NULL,
    "fk_id_projeto" INTEGER NOT NULL,
    "fk_id_visitante" INTEGER,
    "fk_id_avaliador" INTEGER,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VotoExterno_pkey" PRIMARY KEY ("id_voto")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id_avaliacao" SERIAL NOT NULL,
    "fk_id_avaliador" INTEGER NOT NULL,
    "fk_id_projeto" INTEGER NOT NULL,
    "estrelas_inovador" INTEGER NOT NULL,
    "estrelas_acolhedor" INTEGER NOT NULL,
    "comentario" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id_avaliacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avaliador_fk_id_usuario_key" ON "Avaliador"("fk_id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasProjetos_fk_id_projeto_fk_id_categoria_key" ON "CategoriasProjetos"("fk_id_projeto", "fk_id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "Representante_fk_id_aluno_key" ON "Representante"("fk_id_aluno");

-- CreateIndex
CREATE UNIQUE INDEX "VotoInterno_fk_id_evento_fk_id_aluno_key" ON "VotoInterno"("fk_id_evento", "fk_id_aluno");

-- CreateIndex
CREATE UNIQUE INDEX "VotoExterno_fk_id_evento_fk_id_visitante_fk_id_projeto_key" ON "VotoExterno"("fk_id_evento", "fk_id_visitante", "fk_id_projeto");

-- CreateIndex
CREATE UNIQUE INDEX "VotoExterno_fk_id_evento_fk_id_avaliador_fk_id_projeto_key" ON "VotoExterno"("fk_id_evento", "fk_id_avaliador", "fk_id_projeto");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_fk_id_usuario_key" ON "Aluno"("fk_id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_institucional_key" ON "Usuario"("email_institucional");

-- AddForeignKey
ALTER TABLE "Avaliador" ADD CONSTRAINT "Avaliador_fk_id_usuario_fkey" FOREIGN KEY ("fk_id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_fk_id_aluno_fkey" FOREIGN KEY ("fk_id_aluno") REFERENCES "Aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasProjetos" ADD CONSTRAINT "CategoriasProjetos_fk_id_projeto_fkey" FOREIGN KEY ("fk_id_projeto") REFERENCES "Projeto"("id_projeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasProjetos" ADD CONSTRAINT "CategoriasProjetos_fk_id_categoria_fkey" FOREIGN KEY ("fk_id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representante" ADD CONSTRAINT "Representante_fk_id_aluno_fkey" FOREIGN KEY ("fk_id_aluno") REFERENCES "Aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Representante" ADD CONSTRAINT "Representante_fk_id_evento_fkey" FOREIGN KEY ("fk_id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotoInterno" ADD CONSTRAINT "VotoInterno_fk_id_evento_fkey" FOREIGN KEY ("fk_id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotoInterno" ADD CONSTRAINT "VotoInterno_fk_id_aluno_fkey" FOREIGN KEY ("fk_id_aluno") REFERENCES "Aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotoInterno" ADD CONSTRAINT "VotoInterno_fk_id_representante_fkey" FOREIGN KEY ("fk_id_representante") REFERENCES "Representante"("id_representante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotoExterno" ADD CONSTRAINT "VotoExterno_fk_id_evento_fkey" FOREIGN KEY ("fk_id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotoExterno" ADD CONSTRAINT "VotoExterno_fk_id_projeto_fkey" FOREIGN KEY ("fk_id_projeto") REFERENCES "Projeto"("id_projeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotoExterno" ADD CONSTRAINT "VotoExterno_fk_id_visitante_fkey" FOREIGN KEY ("fk_id_visitante") REFERENCES "Visitante"("id_visitante") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VotoExterno" ADD CONSTRAINT "VotoExterno_fk_id_avaliador_fkey" FOREIGN KEY ("fk_id_avaliador") REFERENCES "Avaliador"("id_avaliador") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_fk_id_avaliador_fkey" FOREIGN KEY ("fk_id_avaliador") REFERENCES "Avaliador"("id_avaliador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_fk_id_projeto_fkey" FOREIGN KEY ("fk_id_projeto") REFERENCES "Projeto"("id_projeto") ON DELETE RESTRICT ON UPDATE CASCADE;
