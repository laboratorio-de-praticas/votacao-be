// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // === USUARIOS ===
  const usuario1 = await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      senha: 'senha123',
      email_institucional: 'joao@exemplo.com',
      tipo_usuario: 'Interno',
      status_usuario: 'Ativo',
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nome: 'Ana Lima',
      senha: 'senha456',
      email_institucional: 'ana@exemplo.com',
      tipo_usuario: 'Admin',
      status_usuario: 'Pendente',
    },
  });

  // === USUARIOS ADICIONAIS PARA TESTE ===
  const usuario3 = await prisma.usuario.create({
    data: {
      nome: 'Carlos Souza',
      senha: 'senha789',
      email_institucional: 'carlos@exemplo.com',
      tipo_usuario: 'Interno',
      status_usuario: 'Ativo',
    },
  });
  const usuario4 = await prisma.usuario.create({
    data: {
      nome: 'Maria Oliveira',
      senha: 'senha101',
      email_institucional: 'maria@exemplo.com',
      tipo_usuario: 'Interno',
      status_usuario: 'Ativo',
    },
  });

  // === ALUNOS ===
  const aluno1 = await prisma.aluno.create({
    data: {
      fk_id_usuario: usuario1.id,
      foto_url: 'https://img.com/aluno1.jpg',
      data_matricula: new Date('2022-01-10'),
      curso_semestre: 'DSM-3',
    },
  });

  const aluno2 = await prisma.aluno.create({
    data: {
      fk_id_usuario: usuario2.id,
      foto_url: 'https://img.com/aluno2.jpg',
      data_matricula: new Date('2023-02-15'),
      curso_semestre: 'DSM-4',
    },
  });

  // === ALUNOS ADICIONAIS PARA TESTE ===
  const aluno3 = await prisma.aluno.create({
    data: {
      fk_id_usuario: usuario3.id,
      foto_url: 'https://img.com/aluno3.jpg',
      data_matricula: new Date('2023-03-10'),
      curso_semestre: 'DSM-3',
    },
  });

  const aluno4 = await prisma.aluno.create({
    data: {
      fk_id_usuario: usuario4.id,
      foto_url: 'https://img.com/aluno4.jpg',
      data_matricula: new Date('2023-03-10'),
      curso_semestre: 'DSM-4',
    },
  });

  // === VISITANTES ===
  const visitante1 = await prisma.visitante.create({
    data: {
      nome: 'Visitante 1',
      telefone: '111111111',
      chave_acesso: 'ABCD',
    },
  });

  const visitante2 = await prisma.visitante.create({
    data: {
      nome: 'Visitante 2',
      telefone: '222222222',
      chave_acesso: 'EFGH',
    },
  });

  // === AVALIADORES ===
  const avaliador1 = await prisma.avaliador.create({
    data: {
      fk_id_usuario: usuario1.id,
      nome: 'Avaliador João',
      telefone: '999999999',
    },
  });

  const avaliador2 = await prisma.avaliador.create({
    data: {
      fk_id_usuario: usuario2.id,
      nome: 'Avaliador Ana',
      telefone: '888888888',
    },
  });

  // === EVENTOS ===
  const evento1 = await prisma.evento.create({
    data: {
      tipo_evento: 'Interno',
      nome_evento: 'Feira 2025',
      descricao_evento: 'Projetos de 2025',
      status_evento: 'Ativo',
      curso_semestre: 'DSM-3',
      data_inicio: new Date(Date.now()),
      data_fim: new Date(new Date().setFullYear(2026)),
    },
  });

  const evento2 = await prisma.evento.create({
    data: {
      tipo_evento: 'Externo',
      nome_evento: 'Mostra Design',
      descricao_evento: 'Design criativo',
      status_evento: 'Ativo',
      curso_semestre: 'DSM-4',
      data_inicio: new Date(Date.now()),
      data_fim: new Date(new Date().setFullYear(2026)),
    },
  });

  // === REPRESENTANTES ===
  const representante1 = await prisma.representante.create({
    data: {
      fk_id_aluno: aluno1.id_aluno,
      fk_id_evento: evento1.id_evento,
      qrcode: 'QR1',
      RepresentanteSituacao: 'Ativo',
    },
  });

  const representante2 = await prisma.representante.create({
    data: {
      fk_id_aluno: aluno2.id_aluno,
      fk_id_evento: evento2.id_evento,
      qrcode: 'QR2',
      RepresentanteSituacao: 'Pendente',
    },
  });

  // === REPRESENTANTES ADICIONAIS ===
  const representante3 = await prisma.representante.create({
    data: {
      fk_id_aluno: aluno3.id_aluno,
      fk_id_evento: evento1.id_evento, // Interno
      qrcode: 'QR3',
      RepresentanteSituacao: 'Ativo',
    },
  });

  // === PROJETOS ===
  const projeto1 = await prisma.projeto.create({
    data: {
      titulo: 'Energia Solar',
      descricao: 'Projeto de energia renovável',
      qrcode: 'SOLAR1',
      foto_url: 'https://img.com/solar.jpg',
      fk_id_aluno: aluno1.id_aluno,
    },
  });

  const projeto2 = await prisma.projeto.create({
    data: {
      titulo: 'Design Inclusivo',
      descricao: 'Acessibilidade em design',
      qrcode: 'DESIGN2',
      foto_url: 'https://img.com/design.jpg',
      fk_id_aluno: aluno2.id_aluno,
    },
  });

  // === CATEGORIAS ===
  const categoria1 = await prisma.categoria.create({
    data: {
      nome: 'Sustentabilidade',
      descricao: 'Projetos verdes',
    },
  });

  const categoria2 = await prisma.categoria.create({
    data: {
      nome: 'Inovação',
      descricao: 'Tecnologia de ponta',
    },
  });

  // === CATEGORIAS_PROJETOS ===
  await prisma.categoriasProjetos.create({
    data: {
      fk_id_projeto: projeto1.id_projeto,
      fk_id_categoria: categoria1.id_categoria,
    },
  });

  await prisma.categoriasProjetos.create({
    data: {
      fk_id_projeto: projeto2.id_projeto,
      fk_id_categoria: categoria2.id_categoria,
    },
  });

  // === VOTOS INTERNOS ===
  await prisma.votoInterno.create({
    data: {
      fk_id_evento: evento1.id_evento,
      fk_id_aluno: aluno1.id_aluno,
      fk_id_representante: representante2.id_representante,
    },
  });

  await prisma.votoInterno.create({
    data: {
      fk_id_evento: evento2.id_evento,
      fk_id_aluno: aluno2.id_aluno,
      fk_id_representante: representante1.id_representante,
    },
  });

  // === VOTOS EXTERNOS ===
  await prisma.votoExterno.create({
    data: {
      fk_id_evento: evento1.id_evento,
      fk_id_projeto: projeto1.id_projeto,
      fk_id_visitante: visitante1.id_visitante,
    },
  });

  await prisma.votoExterno.create({
    data: {
      fk_id_evento: evento2.id_evento,
      fk_id_projeto: projeto2.id_projeto,
      fk_id_avaliador: avaliador2.id_avaliador,
    },
  });

  // === AVALIAÇÕES ===
  await prisma.avaliacao.create({
    data: {
      fk_id_avaliador: avaliador1.id_avaliador,
      fk_id_projeto: projeto1.id_projeto,
      estrelas_inovador: 5,
      estrelas_acolhedor: 4,
      comentario: 'Excelente!',
    },
  });

  await prisma.avaliacao.create({
    data: {
      fk_id_avaliador: avaliador2.id_avaliador,
      fk_id_projeto: projeto2.id_projeto,
      estrelas_inovador: 3,
      estrelas_acolhedor: 5,
      comentario: 'Muito acolhedor!',
    },
  });

  console.log('🌱 Seed with 2 entries per model completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
