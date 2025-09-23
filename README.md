# 🎲 Desafio Custom Node n8n - Random Number Generator

Este projeto implementa um conector personalizado para n8n que gera números verdadeiramente aleatórios usando a API do Random.org.

## 📋 Descrição do Projeto

Um conector customizado do n8n que recebe inputs de mínimo e máximo (números inteiros, ambos inclusivos) e retorna um número aleatório verdadeiramente randômico usando a API do Random.org.

## 🎯 Funcionalidades

- **Conector Random**: Nó personalizado para n8n
- **Operação**: "True Random Number Generator"
- **Inputs**: Min e Max (apenas números)
- **API**: Random.org (https://www.random.org/integers/)
- **Interface**: Nomes amigáveis e descrições claras
- **Ícone**: SVG personalizado incluído

## 🛠️ Pré-requisitos

- **Node.js 22 (LTS)** + **TypeScript**
- **Docker** e **Docker Compose**
- **Git**

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd "Desafio custom node n8n"
```

### 2. Configure as Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite as variáveis conforme necessário
# As configurações padrão já funcionam para desenvolvimento local
```

### 3. Instale as Dependências do Custom Node
```bash
cd n8n-custom-random-node
npm install
```

### 4. Build do Custom Node
```bash
npm run build
```

## 🐳 Executando com Docker

### 1. Inicie os Serviços
```bash
# Na raiz do projeto
docker-compose up -d
```

### 2. Verifique se os Serviços Estão Rodando
```bash
docker-compose ps
```

### 3. Acesse o n8n
- **URL**: http://localhost:5678
- **Usuário**: admin
- **Senha**: admin123

## 📦 Estrutura do Projeto

```
📁 Desafio custom node n8n/
├── 📄 docker-compose.yml          # Configuração Docker (n8n + PostgreSQL)
├── 📄 .env.example               # Variáveis de ambiente de exemplo
├── 📄 setup.ps1                 # Script de setup para Windows
├── 📄 setup.sh                  # Script de setup para Linux/Mac
└── 📁 n8n-custom-random-node/   # Código do custom node
    ├── 📄 package.json          # Dependências e scripts npm
    ├── 📄 tsconfig.json         # Configuração TypeScript
    ├── 📄 gulpfile.js           # Build do ícone SVG
    ├── 📁 resources/            # Recursos (ícones)
    ├── 📁 src/                  # Código fonte
    └── 📁 dist/                 # Código compilado (gerado)
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Desenvolvimento com watch
npm run dev

# Linting
npm run lint
npm run lint:fix

# Limpar build
npm run clean
```

### Estrutura do Custom Node

```
📁 src/nodes/Random/
├── 📄 Random.node.ts                    # Classe principal do nó
├── 📁 config/                          # Configurações
│   ├── 📄 constants.ts                 # Constantes e limites
│   ├── 📄 node-description.ts          # Descrição do nó
│   └── 📄 node-properties.ts           # Propriedades dos campos
├── 📁 operations/                      # Lógica de operações
│   └── 📄 RandomOperation.ts           # Operação do Random.org
├── 📁 services/                        # Serviços auxiliares
│   └── 📄 ParameterService.ts          # Extração de parâmetros
└── 📁 executors/                       # Executores
    └── 📄 SimpleExecutor.ts            # Executor principal
```

## 🧪 Testando o Custom Node

### 1. Certifique-se que o n8n está rodando
```bash
docker-compose up -d
curl http://localhost:5678/healthz
```

### 2. Acesse a Interface
- Abra http://localhost:5678
- Faça login com admin/admin123

### 3. Crie um Workflow
1. Clique em "Add first step"
2. Procure por "Random" 
3. Selecione o nó "Random"
4. Configure:
   - **Operação**: True Random Number Generator
   - **Min**: Valor mínimo (ex: 1)
   - **Max**: Valor máximo (ex: 100)
5. Execute o workflow

### 4. Resultado Esperado
```json
{
  "result": 42,
  "min": 1,
  "max": 100,
  "timestamp": "2025-09-23 14:30:45 UTC",
  "source": "Random.org API"
}
```

## 🌐 API Random.org

O custom node utiliza a API oficial do Random.org:

- **Endpoint**: `https://www.random.org/integers/`
- **Parâmetros**: `?num=1&min={min}&max={max}&col=1&base=10&format=plain&rnd=new`
- **Método**: GET
- **Resposta**: Número inteiro em texto plano

### Limites da API
- **Mínimo**: -1.000.000.000
- **Máximo**: 1.000.000.000

## 📊 Banco de Dados

O projeto usa PostgreSQL para armazenar dados do n8n:

- **Host**: localhost:5432
- **Database**: n8n
- **User**: n8n
- **Password**: n8n

### Persistência
Os dados são persistidos em volumes Docker:
- `postgres_data`: Dados do PostgreSQL
- `n8n_data`: Dados do n8n

## 🔒 Segurança

### Autenticação n8n
- **Usuário**: admin
- **Senha**: admin123 (altere em produção)

### Variáveis de Ambiente Sensíveis
```bash
# .env
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
POSTGRES_PASSWORD=n8n
```

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Custom Node não aparece no n8n
```bash
# Verifique se o build foi feito
cd n8n-custom-random-node && npm run build

# Verifique se o volume está montado corretamente
docker-compose logs n8n
```

#### 2. Erro de conexão com Random.org
- Verifique conexão com internet
- Confirme se os limites de min/max estão corretos

#### 3. PostgreSQL não conecta
```bash
# Reinicie os serviços
docker-compose down && docker-compose up -d

# Verifique logs
docker-compose logs postgres
```

#### 4. n8n não carrega
```bash
# Verifique se a porta 5678 está disponível
netstat -an | findstr 5678

# Reinicie o serviço
docker-compose restart n8n
```

## 📝 Scripts de Setup

### Windows (PowerShell)
```powershell
.\setup.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x setup.sh
./setup.sh
```

## 🔄 Atualizações

Para atualizar o custom node após mudanças:

```bash
# 1. Rebuild o custom node
cd n8n-custom-random-node
npm run build

# 2. Reinicie o n8n
docker-compose restart n8n
```

## 📖 Documentação Adicional

- **[Documentação Oficial n8n](https://docs.n8n.io/)**
- **[Creating Custom Nodes](https://docs.n8n.io/integrations/creating-nodes/)**
- **[Random.org API Documentation](https://www.random.org/clients/http/)**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique a seção de Troubleshooting
2. Consulte os logs: `docker-compose logs`
3. Abra uma issue no repositório

---

**Desenvolvido para o desafio técnico da Onfly** 🚀