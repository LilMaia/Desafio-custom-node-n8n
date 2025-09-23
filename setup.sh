#!/bin/bash

echo "🚀 Iniciando setup do n8n Custom Random Node..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    echo "   Download: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 22 primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Versão do Node.js muito antiga. Por favor, instale o Node.js 18+ ou 22 (LTS)."
    exit 1
fi

echo "✅ Dependências verificadas!"

# Instalar dependências do custom node
echo "📦 Instalando dependências do custom node..."
cd n8n-custom-random-node
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências do npm."
    exit 1
fi

# Compilar o custom node
echo "🔨 Compilando o custom node..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar o custom node."
    exit 1
fi

cd ..

# Copiar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Iniciar os serviços Docker
echo "🐳 Iniciando serviços Docker..."

# Tentar docker compose primeiro (versão mais nova), depois docker-compose
DOCKER_COMPOSE_CMD=""
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
fi

if [ -z "$DOCKER_COMPOSE_CMD" ]; then
    echo "❌ Docker Compose não está disponível. Verifique se o Docker está instalado e executando."
    exit 1
fi

echo "   Usando: $DOCKER_COMPOSE_CMD"
$DOCKER_COMPOSE_CMD up -d

if [ $? -ne 0 ]; then
    echo "❌ Erro ao iniciar os serviços Docker."
    exit 1
fi

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Aguarde alguns segundos para os serviços inicializarem"
echo "   2. Acesse http://localhost:5678"
echo "   3. Faça login com:"
echo "      Usuário: admin"
echo "      Senha: admin123"
echo "   4. Crie um novo workflow e adicione o node 'Random'"
echo ""
echo "🔧 Comandos úteis:"
echo "   $DOCKER_COMPOSE_CMD logs -f n8n     # Ver logs do n8n"
echo "   $DOCKER_COMPOSE_CMD logs -f postgres # Ver logs do PostgreSQL"
echo "   $DOCKER_COMPOSE_CMD stop            # Parar os serviços"
echo "   $DOCKER_COMPOSE_CMD down            # Parar e remover containers"
echo ""