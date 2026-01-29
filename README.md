# LBM Advogados - Sistema de Gestão Jurídica

Sistema completo de gestão para escritório de advocacia com separação de frontend e backend.

## Estrutura do Projeto

```
lbm-advogados/
├── backend/          # API Node.js + Express + Prisma
├── frontend/         # React + TypeScript + TailwindCSS
├── docker-compose.yml
└── README.md
```

## Tecnologias

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- MinIO (armazenamento de arquivos)

### Frontend
- React + TypeScript
- TailwindCSS
- React Router
- Axios

## Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- npm ou yarn

## Como Executar

### 1. Subir os serviços (PostgreSQL e MinIO)

```bash
docker-compose up -d
```

### 2. Configurar o Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 3. Configurar o Frontend

```bash
cd frontend
npm install
npm run dev
```

## Acessos

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **MinIO Console**: http://localhost:9001
  - Usuário: `minioadmin`
  - Senha: `minioadmin123`
- **PostgreSQL**: localhost:5432
  - Database: `lbm_advogados`
  - User: `lbm_user`
  - Password: `lbm_password`

## Telas Disponíveis

1. **Login** - Autenticação de usuários
2. **Dashboard do Escritório** - Visão geral do escritório
3. **Dashboard por Cliente** - Visão específica por cliente
4. **Cadastro de Clientes** - Formulário de cadastro
5. **Acompanhamento Processual** - Listagem e gestão de processos
6. **Monitoramento por CNPJ** - Busca e monitoramento de processos

## Variáveis de Ambiente

### Backend (.env)
```
DATABASE_URL="postgresql://lbm_user:lbm_password@localhost:5432/lbm_advogados"
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin123"
MINIO_BUCKET="lbm-documents"
JWT_SECRET="seu-jwt-secret-aqui"
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

