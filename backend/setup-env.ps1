# Script PowerShell para criar arquivo .env
# Execute: .\setup-env.ps1

$envContent = @"
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
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8
Write-Host "✅ Arquivo .env criado com sucesso!" -ForegroundColor Green
Write-Host "📝 Verifique as configurações antes de continuar." -ForegroundColor Yellow

