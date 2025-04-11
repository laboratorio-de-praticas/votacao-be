-- CreateEnum
CREATE TYPE "UsuarioTipos" AS ENUM ('Admin', 'Atendente');

-- CreateEnum
CREATE TYPE "EventoTipos" AS ENUM ('Externo', 'Interno');

-- CreateEnum
CREATE TYPE "EventoStatus" AS ENUM ('Ativo', 'Em_Preparo', 'Em_Contagem', 'Finalizado');

-- CreateEnum
CREATE TYPE "CandidatoSituacao" AS ENUM ('Pendente', 'Ativo', 'Encerrado');

-- CreateEnum
CREATE TYPE "UsuarioStatus" AS ENUM ('Pendente', 'Ativo', 'Desligado');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT,
    "senha" TEXT,
    "email_institucional" TEXT,
    "tipo_usuario" "UsuarioTipos" NOT NULL,
    "status_usuario" "UsuarioStatus" NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id_projeto" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id_projeto")
);

-- CreateTable
CREATE TABLE "FotoProjeto" (
    "id_foto_projeto" SERIAL NOT NULL,
    "foto_url" TEXT,
    "foto_extensao" TEXT,
    "fk_id_projeto" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoProjeto_pkey" PRIMARY KEY ("id_foto_projeto")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nome" TEXT,
    "descricao" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "CategoriasProjeto" (
    "id" SERIAL NOT NULL,
    "fk_id_projeto" INTEGER NOT NULL,
    "fk_id_categoria" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriasProjeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id_aluno" SERIAL NOT NULL,
    "foto_url" TEXT,
    "data_ingresso" TIMESTAMP(3),
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "curso_semestre" TEXT,
    "fk_id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id_aluno")
);

-- CreateTable
CREATE TABLE "Visitante" (
    "id_visitante" SERIAL NOT NULL,
    "nome_social" TEXT,
    "celular" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "chave_acesso" CHAR(4),

    CONSTRAINT "Visitante_pkey" PRIMARY KEY ("id_visitante")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id_evento" SERIAL NOT NULL,
    "tipo_evento" "EventoTipos" NOT NULL,
    "nome_evento" TEXT,
    "descricao_evento" TEXT,
    "status_evento" "EventoStatus" NOT NULL,
    "curso_semestre" TEXT,
    "data_inicio" TIMESTAMP(3),
    "data_fim" TIMESTAMP(3),
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "Candidato" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "id_projeto" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "qrcode" TEXT,
    "situacao_candidato" "CandidatoSituacao" NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_alteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participante" (
    "id_participante" SERIAL NOT NULL,
    "id_aluno" INTEGER,
    "id_visitante" INTEGER,
    "id_evento" INTEGER NOT NULL,
    "avaliador" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id_participante")
);

-- CreateTable
CREATE TABLE "Voto" (
    "id_voto" SERIAL NOT NULL,
    "id_candidato" INTEGER NOT NULL,
    "id_participante" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,

    CONSTRAINT "Voto_pkey" PRIMARY KEY ("id_voto")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasProjeto_fk_id_projeto_fk_id_categoria_key" ON "CategoriasProjeto"("fk_id_projeto", "fk_id_categoria");

-- AddForeignKey
ALTER TABLE "FotoProjeto" ADD CONSTRAINT "FotoProjeto_fk_id_projeto_fkey" FOREIGN KEY ("fk_id_projeto") REFERENCES "Projeto"("id_projeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasProjeto" ADD CONSTRAINT "CategoriasProjeto_fk_id_projeto_fkey" FOREIGN KEY ("fk_id_projeto") REFERENCES "Projeto"("id_projeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasProjeto" ADD CONSTRAINT "CategoriasProjeto_fk_id_categoria_fkey" FOREIGN KEY ("fk_id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_fk_id_usuario_fkey" FOREIGN KEY ("fk_id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "Aluno"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_id_projeto_fkey" FOREIGN KEY ("id_projeto") REFERENCES "Projeto"("id_projeto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "Aluno"("id_aluno") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_id_visitante_fkey" FOREIGN KEY ("id_visitante") REFERENCES "Visitante"("id_visitante") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_id_candidato_fkey" FOREIGN KEY ("id_candidato") REFERENCES "Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_id_participante_fkey" FOREIGN KEY ("id_participante") REFERENCES "Participante"("id_participante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id_evento") ON DELETE RESTRICT ON UPDATE CASCADE;
