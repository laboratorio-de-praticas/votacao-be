<p align="center">
  <a href="https://fatecregistro.cps.sp.gov.br/" target="blank"><img src="https://bkpsitecpsnew.blob.core.windows.net/uploadsitecps/sites/40/2024/03/fatec_registro.png" width="300" alt="Fatec Logo" /></a>
</p>

<p align="center">Laboratório de Práticas é de realização da <a href="https://fatecregistro.cps.sp.gov.br/" target="_blank">Fatec Registro</a> com o objetivo de acrescentar aos alunos um portfólio e, não menos importante, experiência!</p>
<p align="center">
<a href="https://www.instagram.com/fatecregistro/" target="_blank"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Fatec Registro Instagram" /></a>
</p>

<h1 align="center">Sistema de Votação</h1>

## 📋 Descrição

Sistema seguro para votação de representantes de turma e projetos das feiras FTX/HubTec, integrado com microsserviços de autenticação.

## 👔 Principais tecnologias utilizadas

- [![Nest.js](https://img.shields.io/badge/-NestJs-ea2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/) (v10)
- [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/) (ORM)
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/) (v15)
- [![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/) (Conteinerização)

### Pacotes complementares
- [![class-validator](https://img.shields.io/badge/class--validator-0.14.0-green?style=flat-square)](https://github.com/typestack/class-validator)

## 🔧 Fluxogramas do Sistema

### Votação Interna (Representantes)
```mermaid
flowchart TD
    A[Aluno acessa sistema] --> B{Autenticado?}
    B -->|Sim| C[Consulta turma no CMS]
    B -->|Não| Z[Redireciona para login]
    C --> D{É da turma 2024-1?}
    D -->|Sim| E[Lista candidatos aprovados]
    D -->|Não| Y[Erro: Turma inválida]
    E --> F[Seleciona candidato]
    F --> G[Registra voto]
    G --> H[Confirmação]
    
    classDef sucesso fill:#e6f7ff,stroke:#1890ff;
    classDef erro fill:#fff1f0,stroke:#ff4d4f;
    class A,B,C,D,E,F,G,H sucesso;
    class Y,Z erro;
```

### Votação Pública (Feira FTX/HubTec)
```mermaid
flowchart TD
    A[Visitante faz check-in] --> B[Gera token temporário]
    B --> C[Scan QR Code]
    C --> D{Token válido?}
    D -->|Sim| E[Exibe projeto]
    D -->|Não| X[Erro: Token inválido]
    E --> F[Registra voto]
    F --> G[Invalida token para este projeto]
    G --> H[Confirmação]
   
    subgraph Avaliadores
        AV[Avaliador externo] --> CR[Seleciona critérios]
        CR --> CO[Adiciona comentário]
        CO --> VO[Registra avaliação]
    end
    
    classDef sucesso fill:#f6ffed,stroke:#52c41a;
    classDef processo fill:#fff7e6,stroke:#fa8c16;
    classDef erro fill:#fff1f0,stroke:#ff4d4f;
    class A,B,C,D,E,F,G,H sucesso;
    class AV,CR,CO,VO processo;
    class X erro;
```

## 🔧 Configuração do Projeto

<details>
<summary>🐳 Configuração com Docker</summary>

```bash
# Banco de Dados
docker run --name votacao-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=votacao_db -p 5432:5432 -d postgres

# Aplicação
docker build -t votacao-api .
docker run -p 3000:3000 --link votacao-db votacao-api
```
</details>

<details>
<summary>🔑 Variáveis de Ambiente</summary>

```env
POSTGRES_USER="seu_usuario"
POSTGRES_PASSWORD="sua_senha"
POSTGRES_DB="votacao_db"
DATABASE_URL="sua_url"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```
</details>


## 📌 Integração entre Microsserviços

```mermaid
flowchart LR
    CMS["Serviço de CMS"] -->|Dados de Usuários| Votação
    Autenticação -->|Valida tokens| Votação
    Votação -->|Registra votos| Banco[(PostgreSQL)]
    
    classDef service fill:#f0f0f0,stroke:#666,rounded:5px;
    class CMS,Autenticação,Votação service;
    class Banco database;
```

Principais garantias:
1. Sincronização automática com CMS
2. Validação em tempo real com serviço de autenticação
3. Consistência transacional nos registros

## 🚀 Execução

```bash
# Instalação
npm install

# Iniciar
docker compose up
```

Acesse a documentação em [http://localhost:3001/api](http://localhost:3001/api) para ver os endpoints disponíveis.