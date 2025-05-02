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

## 🔧 Fluxograma do Sistema

```mermaid
flowchart TD
    subgraph Votação Interna
        A1[Candidato se registra] --> B1[Validação via CMS]
        B1 --> C1[Aprovação pendente]
        C1 -- Aprovado --> D1[Disponível para votação]
        V1[Eleitor autenticado] --> F1[Verificação de turma]
        F1 -- Turma válida --> G1[Seleciona candidato]
        G1 --> H1[Registra voto]
    end

    subgraph Votação Pública
        A2[Visitante faz check-in] --> B2[Gera token único]
        B2 --> C2[Scan QR Code]
        C2 --> D2[Valida token]
        D2 -- Válido --> E2[Exibe projeto]
        E2 --> F2[Registra voto]
        F2 --> G2[Invalida token para projeto]
        
        Avaliador[Avaliador Externo] --> Crit[Seleciona critérios]
        Crit --> Coment[Comentário opcional]
    end

    classDef votacao fill:#e6f3ff,stroke:#3385ff;
    classDef processo fill:#ffe6e6,stroke:#ff3333;
    class A1,B1,C1,D1,V1,F1,G1,H1,A2,B2,C2,D2,E2,F2,G2,Avaliador,Crit,Coment processo;
    class Votação_Interna,Votação_Pública votacao;
```

**Legenda:**
- `Verde`: Fluxo principal
- `Vermelho`: Pontos de validação crítica
- `Azul`: Sub-sistemas

## 🔧 Configuração do Projeto

<details>
<summary>🐳 Configuração com Docker</summary>

```bash
# Banco de Dados
docker run --name votacao-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=votacao -p 5432:5432 -d postgres

# Aplicação
docker build -t votacao-api .
docker run -p 3000:3000 --link votacao-db votacao-api
```
</details>

<details>
<summary>🔑 Variáveis de Ambiente</summary>

```env
DATABASE_URL="postgresql://admin:admin@localhost:5432/votacao?schema=public"
AUTH_SERVICE_URL="http://autenticacao-service"
VOTACAO_ABERTA="true"
TOKEN_SECRET="sua_chave_secreta"
```
</details>

## 🛡️ Regras de Segurança

- Toda votação interna utiliza o serviço de autenticação externo
- Tokens temporários para votação pública com validade de 12h
- Validação de IP para prevenção de ataques DDoS
- Criptografia de votos usando SHA-256

## 📌 Pontos de Atenção

```mermaid
flowchart LR
    CMS -- Sincroniza dados --> Votação
    Autenticação -- Valida tokens --> Votação
    Votação -- Registra votos --> BancoDados[(PostgreSQL)]
    
    classDef service fill:#f0f0f0,stroke:#666;
    class CMS,Autenticação,Votação service;
```

Este diagrama mostra a integração entre os microsserviços. Precisamos garantir que:
1. O serviço de CMS sempre envie dados atualizados
2. A autenticação valide tokens em tempo real
3. O serviço de votação mantenha consistência transacional

## 🚀 Execução

```bash
# Instalação
npm install

# Iniciar
docker compose up
```

Acesse a documentação em [http://localhost:3001/api](http://localhost:3001/api) para ver os endpoints disponíveis.
