# Guia de Instalação - LBM Advogados

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- npm ou yarn

## Passo a Passo

### 1. Subir os Serviços (PostgreSQL e MinIO)

```bash
docker-compose up -d
```

Isso irá iniciar:
- PostgreSQL na porta 5432
- MinIO na porta 9000 (API) e 9001 (Console)

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` baseado no exemplo:

```bash
cp .env.example .env
```

Edite o `.env` e configure as variáveis:

```env
DATABASE_URL="postgresql://lbm_user:lbm_password@localhost:5432/lbm_advogados"
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin123"
MINIO_BUCKET="lbm-documents"
MINIO_USE_SSL=false
JWT_SECRET="seu-jwt-secret-super-seguro-aqui-altere-em-producao"
PORT=3000
NODE_ENV=development
```

Execute as migrações do banco de dados:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

Inicie o servidor backend:

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Configurar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Crie um arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## Credenciais Padrão

Após executar o seed, você pode fazer login com:

- **Email**: `admin@lbm.com.br`
- **Senha**: `admin123`

## Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- **users** - Usuários do sistema
- **clients** - Clientes (PF ou PJ)
- **processes** - Processos jurídicos
- **events** - Eventos relacionados aos processos (audiências, prazos)
- **documents** - Documentos armazenados no MinIO
- **process_monitoring** - Monitoramento de processos por CNPJ

## Acessos

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **MinIO Console**: http://localhost:9001
  - Usuário: `minioadmin`
  - Senha: `minioadmin123`
- **PostgreSQL**: localhost:5432
  - Database: `lbm_advogados`
  - User: `lbm_user`
  - Password: `lbm_password`

## Telas Disponíveis

1. **Login** (`/login`) - Autenticação
2. **Dashboard do Escritório** (`/dashboard`) - Visão geral
3. **Dashboard por Cliente** (`/dashboard/client/:id`) - Visão específica
4. **Cadastro de Clientes** (`/clients/new`) - Formulário de cadastro
5. **Acompanhamento Processual** (`/processes`) - Listagem de processos
6. **Monitoramento por CNPJ** (`/monitoring`) - Busca de processos

## Desenvolvimento

### Backend

- `npm run dev` - Inicia em modo desenvolvimento com hot reload
- `npm run build` - Compila para produção
- `npm run prisma:studio` - Abre o Prisma Studio para visualizar dados

### Frontend

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Preview da build de produção

## Produção

Para produção, certifique-se de:

1. Alterar todas as senhas padrão
2. Configurar variáveis de ambiente adequadas
3. Usar HTTPS
4. Configurar backups do banco de dados
5. Configurar monitoramento e logs

