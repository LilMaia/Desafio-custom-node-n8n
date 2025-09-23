# PowerShell setup script for Windows

Write-Host "🚀 Iniciando setup do n8n Custom Random Node..." -ForegroundColor Green

# Verificar se Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não está instalado. Por favor, instale o Docker Desktop primeiro." -ForegroundColor Red
    Write-Host "   Download: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Verificar se Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js não está instalado. Por favor, instale o Node.js 22 primeiro." -ForegroundColor Red
    exit 1
}

# Verificar versão do Node.js
$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 18) {
    Write-Host "❌ Versão do Node.js muito antiga. Por favor, instale o Node.js 18+ ou 22 (LTS)." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependências verificadas!" -ForegroundColor Green

# Instalar dependências do custom node
Write-Host "📦 Instalando dependências do custom node..." -ForegroundColor Cyan
Set-Location "n8n-custom-random-node"
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do npm." -ForegroundColor Red
    exit 1
}

# Compilar o custom node
Write-Host "🔨 Compilando o custom node..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar o custom node." -ForegroundColor Red
    exit 1
}

Set-Location ".."

# Copiar arquivo .env se não existir
if (-not (Test-Path ".env")) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
}

# Iniciar os serviços Docker
Write-Host "🐳 Iniciando serviços Docker..." -ForegroundColor Cyan

# Tentar docker compose primeiro (versão mais nova), depois docker-compose
$dockerComposeCmd = $null
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    try {
        docker compose version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $dockerComposeCmd = "docker compose"
        }
    } catch {}
}

if (-not $dockerComposeCmd -and (Get-Command "docker-compose" -ErrorAction SilentlyContinue)) {
    $dockerComposeCmd = "docker-compose"
}

if (-not $dockerComposeCmd) {
    Write-Host "❌ Docker Compose não está disponível. Verifique se o Docker Desktop está instalado e executando." -ForegroundColor Red
    exit 1
}

Write-Host "   Usando: $dockerComposeCmd" -ForegroundColor Gray
Invoke-Expression "$dockerComposeCmd up -d"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao iniciar os serviços Docker." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Aguarde alguns segundos para os serviços inicializarem"
Write-Host "   2. Acesse http://localhost:5678"
Write-Host "   3. Faça login com:"
Write-Host "      Usuário: admin"
Write-Host "      Senha: admin123"
Write-Host "   4. Crie um novo workflow e adicione o node 'Random'"
Write-Host ""
Write-Host "🔧 Comandos úteis:" -ForegroundColor Yellow
Write-Host "   $dockerComposeCmd logs -f n8n     # Ver logs do n8n"
Write-Host "   $dockerComposeCmd logs -f postgres # Ver logs do PostgreSQL"
Write-Host "   $dockerComposeCmd stop            # Parar os serviços"
Write-Host "   $dockerComposeCmd down            # Parar e remover containers"
Write-Host ""