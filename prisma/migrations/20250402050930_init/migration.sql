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
    "nome" VARCHAR(250) NOT NULL,
    "senha" VARCHAR(400) NOT NULL,
    "emailInstitucional" VARCHAR(250) NOT NULL,
    "tipoUsuario" "UsuarioTipos" NOT NULL,
    "statusUsuario" "UsuarioStatus" NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(200) NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotosProjeto" (
    "id" SERIAL NOT NULL,
    "fotoUrl" VARCHAR(300),
    "fotoExtensao" VARCHAR(30),
    "fkProjeto" INTEGER NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotosProjeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(120) NOT NULL,
    "descricao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriasProjetos" (
    "id" SERIAL NOT NULL,
    "fkProjeto" INTEGER NOT NULL,
    "fkCategoria" INTEGER NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriasProjetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "id" SERIAL NOT NULL,
    "fotoUrl" VARCHAR(300),
    "dataIngresso" TIMESTAMP(3),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cursoSemestre" VARCHAR(50) NOT NULL,
    "fkUsuario" INTEGER NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitante" (
    "id" SERIAL NOT NULL,
    "nomeSocial" VARCHAR(200) NOT NULL,
    "celular" VARCHAR(12) NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "chaveAcesso" VARCHAR(4) NOT NULL,

    CONSTRAINT "Visitante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "tipoEvento" "EventoTipos" NOT NULL,
    "nomeEvento" VARCHAR(255) NOT NULL,
    "descricaoEvento" TEXT,
    "statusEvento" "EventoStatus" NOT NULL,
    "cursoSemestre" VARCHAR(50),
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidato" (
    "id" SERIAL NOT NULL,
    "idAluno" INTEGER NOT NULL,
    "idProjeto" INTEGER NOT NULL,
    "idEvento" INTEGER NOT NULL,
    "qrCode" VARCHAR(255),
    "situacaoCandidato" "CandidatoSituacao" NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAlteracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" SERIAL NOT NULL,
    "idAluno" INTEGER,
    "idVisitante" INTEGER,
    "idEvento" INTEGER NOT NULL,
    "avaliador" BOOLEAN NOT NULL,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voto" (
    "id" SERIAL NOT NULL,
    "idCandidato" INTEGER NOT NULL,
    "idParticipante" INTEGER NOT NULL,
    "idEvento" INTEGER NOT NULL,

    CONSTRAINT "Voto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_emailInstitucional_key" ON "Usuario"("emailInstitucional");

-- CreateIndex
CREATE UNIQUE INDEX "CategoriasProjetos_fkProjeto_fkCategoria_key" ON "CategoriasProjetos"("fkProjeto", "fkCategoria");

-- AddForeignKey
ALTER TABLE "FotosProjeto" ADD CONSTRAINT "FotosProjeto_fkProjeto_fkey" FOREIGN KEY ("fkProjeto") REFERENCES "Projeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasProjetos" ADD CONSTRAINT "CategoriasProjetos_fkProjeto_fkey" FOREIGN KEY ("fkProjeto") REFERENCES "Projeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriasProjetos" ADD CONSTRAINT "CategoriasProjetos_fkCategoria_fkey" FOREIGN KEY ("fkCategoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aluno" ADD CONSTRAINT "Aluno_fkUsuario_fkey" FOREIGN KEY ("fkUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_idAluno_fkey" FOREIGN KEY ("idAluno") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_idProjeto_fkey" FOREIGN KEY ("idProjeto") REFERENCES "Projeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidato" ADD CONSTRAINT "Candidato_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_idAluno_fkey" FOREIGN KEY ("idAluno") REFERENCES "Aluno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_idVisitante_fkey" FOREIGN KEY ("idVisitante") REFERENCES "Visitante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participante" ADD CONSTRAINT "Participante_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_idCandidato_fkey" FOREIGN KEY ("idCandidato") REFERENCES "Candidato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_idParticipante_fkey" FOREIGN KEY ("idParticipante") REFERENCES "Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voto" ADD CONSTRAINT "Voto_idEvento_fkey" FOREIGN KEY ("idEvento") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
