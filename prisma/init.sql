CREATE TYPE "UsuarioTipos" AS ENUM ('Admin', 'Atendente', 'Professor', 'Interno');
CREATE TYPE "UsuarioStatus" AS ENUM ('Pendente', 'Ativo', 'Desligado');
CREATE TYPE "RepresentanteSituacao" AS ENUM ('Pendente', 'Ativo', 'Desligado');
CREATE TYPE "EventoStatus" AS ENUM ('Ativo', 'Em_Preparo', 'Em_Contagem', 'Finalizado');
CREATE TYPE "EventoTipos" AS ENUM ('Externo', 'Interno');

--- Retirada do Not Null no telefone, "ativo" mudou para "status_usuario"
CREATE TABLE "Usuarios" (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  senha TEXT,
  telefone TEXT,
  email_institucional TEXT UNIQUE,
  tipo_usuario "UsuarioTipos" NOT NULL,
  status_usuario "UsuarioStatus" NOT NULL,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);



--- nome_projeto foi mudado para titulo
--- TLR, CEA, Turma foram adicionados.
--- Imagem capa foi renomeada para foto_url
CREATE TABLE "Projetos" (
  id_projeto SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  nome_equipe TEXT NOT NULL,
  descricao TEXT NOT NULL,
  foto_url TEXT,
  tlr INTEGER NOT NULL, 
  cea INTEGER NOT NULL,
  turma TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()

);

--- Tabela de Alunos
--- Peço a revisão na necessidade do campo "Deseja ser candidato" com a inserção de eventos e o campo "RA", visto que não teremos controle algum sobre esse campo.
CREATE TABLE "Alunos" (
  id_aluno SERIAL PRIMARY KEY,
  fk_id_usuario INT UNIQUE NOT NULL REFERENCES "Usuarios"(id),
  foto_url TEXT,
  deseja_ser_candidato BOOLEAN,
  curso_semestre TEXT,
  ra INTEGER UNIQUE,
  data_matricula TIMESTAMP,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);


CREATE TABLE "ImagensProjeto" (
    id_imagem SERIAL PRIMARY KEY,
    projeto_id INTEGER NOT NULL,
    imagem_url TEXT NOT NULL,
    FOREIGN KEY (projeto_id) REFERENCES "Projetos"(id_projeto)
);

-- Tabela IntegrantesEquipe
CREATE TABLE IntegrantesEquipe (
    id_integrante SERIAL PRIMARY KEY,
    projeto_id INTEGER NOT NULL,
    aluno_id INTEGER NOT NULL,
    FOREIGN KEY (projeto_id) REFERENCES "Projetos"(id_projeto),
    FOREIGN KEY (aluno_id) REFERENCES "Alunos"(id_aluno)
);


CREATE TABLE "ODS" (
    id_ods SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL
);

CREATE TABLE "ProjetoODS" (
    projeto_id INTEGER NOT NULL,
    ods_id INTEGER NOT NULL,
    PRIMARY KEY (projeto_id, ods_id),
    FOREIGN KEY (projeto_id) REFERENCES "Projetos"(id_projeto),
    FOREIGN KEY (ods_id) REFERENCES "ODS"(id_ods)
);

CREATE TABLE "LinhaExtensao" (
    id_linha SERIAL PRIMARY KEY,
    descricao TEXT NOT NULL
);

CREATE TABLE "ProjetoLinhaExtensao" (
    projeto_id INTEGER NOT NULL,
    linha_extensao_id INTEGER NOT NULL,
    PRIMARY KEY (projeto_id, linha_extensao_id),
    FOREIGN KEY (projeto_id) REFERENCES "Projetos"(id_projeto),
    FOREIGN KEY (linha_extensao_id) REFERENCES "LinhaExtensao"(id_linha)
);

--- Antiga tabela de Area Temática
CREATE TABLE "Categorias" (
  id_categoria SERIAL PRIMARY KEY,
  nome TEXT,
  descricao TEXT,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);

--- Antiga tablea de ProjetoAreaTematica
CREATE TABLE "CategoriasProjetos" (
  id SERIAL PRIMARY KEY,
  fk_id_projeto INT NOT NULL REFERENCES "Projetos"(id_projeto),
  fk_id_categoria INT NOT NULL REFERENCES "Categorias"(id_categoria),
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now(),
  UNIQUE(fk_id_projeto, fk_id_categoria)
);

--- Removida senha,cidade e ativo
CREATE TABLE "Visitantes" (
  id_visitante SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  chave_acesso CHAR(4),
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);

CREATE TABLE "Avaliadores" (
  id_avaliador SERIAL PRIMARY KEY,
  fk_id_usuario INT UNIQUE NOT NULL REFERENCES "Usuarios"(id),
  nome TEXT,
  telefone TEXT,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);

CREATE TABLE "Eventos" (
  id_evento SERIAL PRIMARY KEY,
  tipo_evento "EventoTipos" NOT NULL,
  nome_evento TEXT,
  descricao_evento TEXT,
  status_evento "EventoStatus" NOT NULL,
  curso_semestre TEXT,
  ano_semestre TEXT,
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);

CREATE TABLE "ProjetosEventos" (
  id_projetos_eventos SERIAL PRIMARY KEY,
  fk_id_projeto INT NOT NULL REFERENCES "Projetos"(id_projeto),
  fk_id_evento INT NOT NULL REFERENCES "Eventos"(id_evento),
  qrcode TEXT
);

CREATE TABLE "Representantes" (
  id_representante SERIAL PRIMARY KEY,
  descricao_campanha TEXT,
  fk_id_aluno INT UNIQUE NOT NULL REFERENCES "Alunos"(id_aluno),
  fk_id_evento INT NOT NULL REFERENCES "Eventos"(id_evento),
  qrcode TEXT,
  RepresentanteSituacao "RepresentanteSituacao" NOT NULL,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);

CREATE TABLE "VotosInternos" (
  id_voto SERIAL PRIMARY KEY,
  fk_id_evento INT NOT NULL REFERENCES "Eventos"(id_evento),
  fk_id_aluno INT NOT NULL REFERENCES "Alunos"(id_aluno), 
  fk_id_representante INT NOT NULL REFERENCES "Representantes"(id_representante),
  data_criacao TIMESTAMP DEFAULT now(),
  UNIQUE(fk_id_evento, fk_id_aluno)
);

CREATE TABLE "VotosExternos" (
  id_voto SERIAL PRIMARY KEY,
  fk_id_evento INT NOT NULL REFERENCES "Eventos"(id_evento),
  fk_id_projeto INT NOT NULL REFERENCES "Projetos"(id_projeto),
  fk_id_visitante INT REFERENCES "Visitantes"(id_visitante),
  fk_id_avaliador INT REFERENCES "Avaliadores"(id_avaliador),
  data_criacao TIMESTAMP DEFAULT now(),
  CONSTRAINT chk_autor_unico CHECK (
    (fk_id_visitante IS NOT NULL AND fk_id_avaliador IS NULL) OR
    (fk_id_visitante IS NULL AND fk_id_avaliador IS NOT NULL)
  ),
  UNIQUE(fk_id_evento, fk_id_visitante, fk_id_projeto),
  UNIQUE(fk_id_evento, fk_id_avaliador, fk_id_projeto)
);

CREATE TABLE "Avaliacoes" (
  id_avaliacao SERIAL PRIMARY KEY,
  fk_id_avaliador INT NOT NULL REFERENCES "Avaliadores"(id_avaliador),
  fk_id_projeto INT NOT NULL REFERENCES "Projetos"(id_projeto),
  estrelas_inovador INT NOT NULL,
  estrelas_acolhedor INT NOT NULL,
  comentario TEXT,
  data_criacao TIMESTAMP DEFAULT now(),
  data_alteracao TIMESTAMP DEFAULT now()
);

CREATE TABLE "APIs"(
  id_api SERIAL PRIMARY KEY,
  nome_api TEXT,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_alteracao TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "Endpoints"(
  id_endpoint SERIAL PRIMARY KEY,
  fk_id_api INT NOT NULL,
  url_endpoint TEXT NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW(),
  data_alteracao TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_endpoint) REFERENCES "APIs"(id_api)
  );

CREATE INDEX IF NOT EXISTS idx_usuario_email ON "Usuarios"(email_institucional);
CREATE INDEX IF NOT EXISTS idx_representante_usuario ON "Representantes"(fk_id_aluno);
CREATE INDEX IF NOT EXISTS idx_projeto_turma ON "Projetos"(turma);
CREATE INDEX IF NOT EXISTS idx_imagens_projeto ON "ImagensProjeto"(projeto_id);

INSERT INTO "Eventos" (id_evento, nome_evento, tipo_evento, descricao_evento, status_evento, curso_semestre, data_alteracao, data_criacao, data_inicio, data_fim)
VALUES
(1, 'Representante de Classe', 'Interno', 'Evento para alunos DSM5', 'Ativo', 'DSM5', NOW(), NOW(), NOW(), NOW() + INTERVAL '1 month'),
(3, 'Feira de Profissões', 'Externo', 'Evento aberto ao público', 'Ativo', 'DSM5', NOW(), NOW(), NOW(), NOW() + INTERVAL '1 month'),
(4, 'Feira de Profissões', 'Externo', 'Evento aberto ao público', 'Ativo', 'DSM5', NOW(), NOW(), NOW(), NOW() + INTERVAL '1 month'),
(2, 'Representante de Classe', 'Interno', 'Evento para alunos GE1', 'Ativo', 'GE1', NOW(), NOW(), NOW(), NOW() + INTERVAL '1 month');

INSERT INTO "Usuarios" (id, nome, data_alteracao, data_criacao, senha, email_institucional, tipo_usuario, status_usuario)
VALUES
(1, 'Renato Hioji', NOW(), NOW(), '$2b$10$KRPrIGoPkM5RbtRrWdx.Au4frTROUrj9rdp6p8VPgLY2DG1mE72E.', 'renato_odake@fatec.sp.gov.br', 'Interno', 'Ativo'),
(2, 'Saulo de Freitas', NOW(), NOW(), '$2b$10$KRPrIGoPkM5RbtRrWdx.Au4frTROUrj9rdp6p8VPgLY2DG1mE72E.', 'saulo@fatec.sp.gov.br', 'Interno', 'Ativo'),
(3, 'Letícia Imasato', NOW(), NOW(), '$2b$10$KRPrIGoPkM5RbtRrWdx.Au4frTROUrj9rdp6p8VPgLY2DG1mE72E.', 'let_imasato@fatec.sp.gov.br', 'Interno', 'Ativo'),
(4, 'Gabriel Rodriguez', NOW(), NOW(), '$2b$10$KRPrIGoPkM5RbtRrWdx.Au4frTROUrj9rdp6p8VPgLY2DG1mE72E.', 'gabriel_rod@fatec.sp.gov.br', 'Interno', 'Ativo'),
(5, 'Administrador', NOW(), NOW(), '$2b$10$KRPrIGoPkM5RbtRrWdx.Au4frTROUrj9rdp6p8VPgLY2DG1mE72E.', 'admin@fatec.sp.gov.br', 'Admin', 'Ativo');;

INSERT INTO "Alunos" (id_aluno, foto_url, data_criacao, data_alteracao, data_matricula, curso_semestre, fk_id_usuario)
VALUES
(1, '/candi4.jpg', NOW(), NOW(), '2025-01-15', 'DSM5', 1),
(2, '/candi2.jpg', NOW(), NOW(), '2025-01-15', 'DSM5', 2),
(3, '/candi1.jpg', NOW(), NOW(), '2025-01-15', 'DSM5', 3),
(4, '/candi3.jpg', NOW(), NOW(), '2025-01-15', 'DSM5', 4);

INSERT INTO "Representantes" (id_representante, data_alteracao, data_criacao, representantesituacao, qrcode, fk_id_evento, fk_id_aluno)
VALUES
(1, NOW(), NOW(), 'Ativo', 'http://10.67.56.95:3000/votacao/interna/confirmacao/1/1', 1, 1),
(2, NOW(), NOW(), 'Ativo', 'http://10.67.56.95:3000/votacao/interna/confirmacao/1/2', 1, 2),
(3, NOW(), NOW(), 'Ativo', 'http://10.67.56.95:3000/votacao/interna/confirmacao/1/3', 1, 3),
(4, NOW(), NOW(), 'Ativo', 'http://10.67.56.95:3000/votacao/interna/confirmacao/1/4', 1, 4);



INSERT INTO "Categorias" (descricao) VALUES
('Comunicação'),
('Cultura'),
('Direitos humanos e justiça'),
('Educação'),
('Meio ambiente'),
('Saúde'),
('Tecnologia e Produção');

-- Inserir Linhas de Extensão
INSERT INTO "LinhaExtensao" (descricao) VALUES
('Alfabetização, leitura e escrita'),
('Artes cênicas'),
('Artes integradas'),
('Artes plásticas'),
('Artes visuais'),
('Comunicação estratégica'),
('Desenvolvimento de produtos'),
('Desenvolvimento regional'),
('Desenvolvimento rural e questão agrária'),
('Desenvolvimento tecnológico'),
('Desenvolvimento urbano'),
('Direitos individuais e coletivos'),
('Educação profissional'),
('Empreendedorismo'),
('Emprego e renda'),
('Endemias e epidemias'),
('Divulgação científica e tecnológica'),
('Esporte e lazer'),
('Estilismo'),
('Fármacos e medicamentos'),
('Formação de professores'),
('Gestão do trabalho'),
('Gestão informacional'),
('Gestão institucional'),
('Gestão pública'),
('Grupos sociais vulneráveis'),
('Infância e adolescência'),
('Inovação tecnológica'),
('Jornalismo'),
('Jovens e adultos'),
('Línguas Estrangeiras'),
('Metodologias e estratégias de ensino/aprendizagem'),
('Mídia-artes'),
('Mídias'),
('Música'),
('Organizações da sociedade civil e movimentos sociais e populares'),
('Patrimônio cultural, histórico e natural'),
('Pessoas com deficiências, incapacidades e necessidades especiais'),
('Propriedade intelectual e patente'),
('Questões ambientais'),
('Recursos hídricos'),
('Resíduos sólidos'),
('Saúde animal'),
('Saúde da família'),
('Saúde e proteção no trabalho'),
('Saúde humana'),
('Segurança alimentar e nutricional'),
('Segurança pública e defesa social'),
('Tecnologia da informação'),
('Terceira Idade'),
('Turismo'),
('Uso de drogas e dependência química'),
('Desenvolvimento humano');

-- Inserir ODS da Agenda 2030 da ONU
INSERT INTO "ODS" (descricao) VALUES
('ODS 1 - Erradicação da pobreza'),
('ODS 2 - Fome zero e agricultura sustentável'),
('ODS 3 - Saúde e bem-estar'),
('ODS 4 - Educação de qualidade'),
('ODS 5 - Igualdade de gênero'),
('ODS 6 - Água potável e saneamento'),
('ODS 7 - Energia limpa e acessível'),
('ODS 8 - Trabalho decente e crescimento econômico'),
('ODS 9 - Indústria, inovação e infraestrutura'),
('ODS 10 - Redução das desigualdades'),
('ODS 11 - Cidades e comunidades sustentáveis'),
('ODS 12 - Consumo e produção responsáveis'),
('ODS 13 - Ação contra a mudança global do clima'),
('ODS 14 - Vida na água'),
('ODS 15 - Vida terrestre'),
('ODS 16 - Paz, justiça e instituições eficazes'),
('ODS 17 - Parcerias e meios de implementação');

INSERT INTO "Projetos" (id_projeto, titulo, nome_equipe, descricao, foto_url, tlr, cea, turma, ativo, data_criacao, data_alteracao)
VALUES
(1, 'Projeto Sustentabilidade', 'Equipe Verde', 'Projeto voltado para práticas sustentáveis.', '/projeto1.jpg', 10, 20, 'DSM5', TRUE, NOW(), NOW()),
(2, 'Projeto Tecnologia', 'Equipe Tech', 'Projeto para desenvolvimento de soluções tecnológicas.', '/projeto2.jpg', 15, 25, 'DSM5', TRUE, NOW(), NOW());

INSERT INTO "Visitantes" (nome, telefone, chave_acesso) VALUES
('Maria Silva', '11987654321', 'ABCD');

INSERT INTO "Visitantes" (nome, telefone, chave_acesso) VALUES
('João Pereira', '21998765432', 'WXYZ');

INSERT INTO "Avaliadores" (fk_id_usuario, nome, telefone) VALUES
(1, 'Carla Mendes', '13988776655');

INSERT INTO "Avaliadores" (fk_id_usuario, nome, telefone) VALUES
(2, 'Pedro Almeida', '11977889900');

INSERT INTO "Projetos" (titulo, nome_equipe, descricao, tlr, cea, turma)
VALUES ('Desenvolvimento de Plataforma Educacional Online', 'Inovadores Digitais', 'Criação de uma plataforma de aprendizado interativa com recursos multimídia.', 6, 8, 'Engenharia de Software 2025');

INSERT INTO "Projetos" (titulo, nome_equipe, descricao, foto_url, tlr, cea, turma, ativo)
VALUES ('Sistema Inteligente de Monitoramento Ambiental', 'Guardiões da Natureza', 'Implementação de um sistema IoT para coleta e análise de dados ambientais em tempo real.', 'https://example.com/foto_monitoramento.jpg', 7, 9, 'Ciências Ambientais 2024', FALSE);
