# Deploy no EasyPanel

Backend e frontend têm Dockerfile próprio. Banco e MinIO já existem no EasyPanel; basta configurar as variáveis.

## Backend

- **Dockerfile:** `backend/Dockerfile`
- **Contexto:** `backend/` (ou raiz do repo; ajuste o path do Dockerfile no EasyPanel)
- **Porta:** 3000

**Variáveis de ambiente (Environment):** use as do `.env.easypanel.example` (secção BACKEND).  
O entrypoint roda `prisma migrate deploy` antes de subir a API.

Exemplos:
- `DATABASE_URL`: connection string do Postgres (host = nome do serviço ou URL no EasyPanel)
- `MINIO_ENDPOINT`: host do MinIO (nome do serviço ou URL)
- `JWT_SECRET`: segredo forte em produção
- `CORS_ORIGIN`: URL do frontend (ex: `https://app.seudominio.com`). Várias: separadas por vírgula. **Obrigatório em produção** para o browser aceitar chamadas à API.

## Frontend

- **Dockerfile:** `frontend/Dockerfile`
- **Contexto:** `frontend/`
- **Porta:** 80

**Build argument (obrigatório):**

| Nome            | Exemplo                                | Uso                          |
|-----------------|----------------------------------------|------------------------------|
| `VITE_API_URL`  | `https://backend.seudominio.com/api`   | URL base da API (com `/api`) |

Defina `VITE_API_URL` como **Build argument** no EasyPanel, não como variável de runtime. O frontend é buildado com essa URL.

## Resumo

1. Crie dois apps no EasyPanel (backend e frontend).
2. Backend: configure env com `DATABASE_URL`, MinIO, `JWT_SECRET`, etc.
3. Frontend: configure **build arg** `VITE_API_URL` com a URL pública do backend + `/api`.
4. Aponte os domínios e portas (3000 backend, 80 frontend).
