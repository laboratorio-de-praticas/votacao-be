<p align="center">
  <a href="https://fatecregistro.cps.sp.gov.br/" target="blank"><img src="https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/40/2024/03/fatec_registro.png" width="300" alt="Fatec Logo" /></a>
</p>

<p align="center">Laboratório de Práticas é de realização da <a href="https://fatecregistro.cps.sp.gov.br/" target="_blank">Fatec Registro</a> com o objetivo de acrescentar aos alunos um portfólio e, não menos importante, experiência!</p>
<p align="center">
<a href="https://www.instagram.com/fatecregistro/" target="_blank"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Fatec Registro Instagram" /></a>
</p>

<h1 align="center">Votação</h1>

## 📖 Descrição do Projeto

Este projeto consiste no desenvolvimento de um sistema de votação para a faculdade, permitindo dois tipos de votação:

- **Votação interna e segura** para escolha de representantes de turma.
- **Votação pública** para eleger o melhor projeto das feiras tecnológicas **FTX e HubTec**.

O sistema deve ser seguro, acessível e funcional tanto para usuários internos (alunos e professores) quanto para o público externo. Além disso, o sistema contará com **dashboards e relatórios** detalhados para garantir transparência e permitir auditorias.

## 🛠️ Tecnologias Utilizadas

- **Back-end**: JavaScript | Node.js
- **Banco de Dados**: PostgreSQL

## ⚙️ Como Rodar o Projeto

### 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### 🚀 Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/laboratorio-de-praticas/votacao-be.git
   ```

2. Instale as dependências do backend:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente (crie um arquivo `.env` na pasta `backend` e adicione as configurações necessárias, como conexão com o PostgreSQL e JWT secret).

4. Inicie o servidor backend:
   ```bash
   npm start
   ```

O backend estará rodando em `http://localhost:3000`.

## 🔍 Entendendo o Sistema

### 🎓 Votação dos Representantes

- Candidatos se inscrevem no sistema com o e-mail institucional.
- Apenas alunos da mesma turma podem votar (cada aluno pode votar apenas em um candidato).
- Candidatos indicam sua turma de ingresso ao se inscreverem.
- Após a inscrição, a candidatura ficará pendente até aprovação pelos superiores.

### 🏆 Votação dos Projetos na Feira

- A votação será feita através de um **QR Code** disponível na bancada de cada equipe.
- Cada visitante poderá votar em quantos projetos quiser, desde que seja um único voto por projeto.
- Visitantes deverão fazer um **check-in** na recepção da feira com seu telefone.
- Para votar, o visitante informará seu telefone para validação.

### 🗳️ Tela de Votação

- Para **alunos e convidados**, a tela conterá as informações do representante ou projeto, junto com o botão de "Votar".
- Para **avaliadores externos**, a tela conterá os tópicos citados anteriormente, além de **2 critérios de avaliação**:
  - **Projeto acolhedor** (avaliado em até 5 estrelas).
  - **Projeto inovador** (avaliado em até 5 estrelas).
  - Caixa de comentário opcional para feedback.

📌 **Desenvolvido para proporcionar uma votação segura e transparente!**