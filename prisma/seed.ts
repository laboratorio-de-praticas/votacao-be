/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient, UsuarioTipos, EventoTipos, EventoStatus, CandidatoSituacao, UsuarioStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed...');

  // Criar usuários
  const usuarioAdmin = await prisma.usuario.create({
    data: {
      nome: 'Admin User',
      senha: 'admin123',
      email_institucional: 'admin@faculdade.com',
      tipo_usuario: UsuarioTipos.Admin,
      status_usuario: UsuarioStatus.Ativo,
    },
  });

  const usuarioAluno = await prisma.usuario.create({
    data: {
      nome: 'Aluno Teste',
      senha: 'aluno123',
      email_institucional: 'aluno@faculdade.com',
      tipo_usuario: UsuarioTipos.Atendente,
      status_usuario: UsuarioStatus.Ativo,
    },
  });

  // Criar aluno associado ao usuário
  const aluno = await prisma.aluno.create({
    data: {
      fk_id_usuario: usuarioAluno.id,
      curso_semestre: 'Engenharia - 5º Semestre',
    },
  });

  // Criar visitante
  const visitante = await prisma.visitante.create({
    data: {
      nome_social: 'Visitante Convidado',
      celular: '11999999999',
      chave_acesso: 'ABCD',
    },
  });

  // Criar evento Interno (ativo)
  const eventoInterno = await prisma.evento.create({
    data: {
      nome_evento: 'Semana Acadêmica',
      descricao_evento: 'Evento acadêmico de apresentação de projetos.',
      tipo_evento: EventoTipos.Interno,
      status_evento: EventoStatus.Ativo,
      data_inicio: new Date(),
      data_fim: new Date(new Date().setDate(new Date().getDate() + 5)),
    },
  });

  // Criar evento Público (ativo)
  const eventoPublico = await prisma.evento.create({
    data: {
      nome_evento: 'Feira de Projetos',
      descricao_evento: 'Evento para avaliação de projetos públicos.',
      tipo_evento: EventoTipos.Externo,
      status_evento: EventoStatus.Ativo,
      data_inicio: new Date(),
      data_fim: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    },
  });

  // Criar projeto
  const projeto = await prisma.projeto.create({
    data: {
      titulo: 'Sistema de Votação',
      descricao: 'Projeto de sistema eletrônico de votação.',
    },
  });

  // Criar candidato na votação interna
  const candidatoInterno = await prisma.candidato.create({
    data: {
      id_aluno: aluno.id_aluno,
      id_projeto: projeto.id_projeto,
      id_evento: eventoInterno.id_evento,
      situacao_candidato: CandidatoSituacao.Ativo,
    },
  });

  // Criar candidato na votação pública
  const candidatoPublico = await prisma.candidato.create({
    data: {
      id_aluno: aluno.id_aluno,
      id_projeto: projeto.id_projeto,
      id_evento: eventoPublico.id_evento,
      situacao_candidato: CandidatoSituacao.Ativo,
    },
  });

  // Criar participante (aluno na votação interna)
  const participanteAlunoInterno = await prisma.participante.create({
    data: {
      id_aluno: aluno.id_aluno,
      id_evento: eventoInterno.id_evento,
    },
  });

  // Criar participante (visitante na votação pública)
  const participanteVisitantePublico = await prisma.participante.create({
    data: {
      id_visitante: visitante.id_visitante,
      id_evento: eventoPublico.id_evento,
    },
  });

  // Criar participante avaliador
  const participanteAvaliador = await prisma.participante.create({
    data: {
      id_visitante: visitante.id_visitante,
      id_evento: eventoPublico.id_evento,
      avaliador: true, // ✅ Definido como avaliador
    },
  });

  // Criar voto na votação interna
  await prisma.voto.create({
    data: {
      id_candidato: candidatoInterno.id,
      id_participante: participanteAlunoInterno.id_participante,
      id_evento: eventoInterno.id_evento,
    },
  });

  // Criar voto na votação pública
  await prisma.voto.create({
    data: {
      id_candidato: candidatoPublico.id,
      id_participante: participanteVisitantePublico.id_participante,
      id_evento: eventoPublico.id_evento,
    },
  });

  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });