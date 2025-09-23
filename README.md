# n8n Custom Random Node

Um conector personalizado para n8n que gera números verdadeiramente aleatórios usando a API do Random.org.

## 🎯 Características

- **Geração de números verdadeiramente aleatórios** usando Random.org
- **Operação simples**: "True Random Number Generator"
- **Parâmetros configuráveis**: Valores mínimo e máximo
- **Validação robusta** de entrada
- **Tratamento de erros** abrangente
- **Interface amigável** com descrições claras

## 📋 Pré-requisitos

- **Node.js 22 (LTS)** ou superior ([Download aqui](https://nodejs.org/))
- **Docker Desktop** ([Download aqui](https://www.docker.com/products/docker-desktop/))
  - Windows: Docker Desktop for Windows
  - Mac: Docker Desktop for Mac  
  - Linux: Docker Engine + Docker Compose
- **npm** ou **yarn** (incluído com Node.js)

## 🚀 Instalação e Configuração

### 0. Instalar Dependências

#### Node.js
1. Acesse https://nodejs.org/
2. Baixe e instale a versão LTS (recomendada)
3. Verifique a instalação: `node --version`

#### Docker Desktop
1. Acesse https://www.docker.com/products/docker-desktop/
2. Baixe a versão para seu sistema operacional
3. Instale e inicie o Docker Desktop
4. Verifique a instalação: `docker --version`

### 1. Clone o repositório

```bash
git clone https://github.com/your-username/n8n-custom-random-node.git
cd n8n-custom-random-node
```

### 2. Configure o ambiente

```bash
# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env conforme necessário
```

### 3. Instale as dependências do custom node

```bash
cd n8n-custom-random-node
npm install
```

### 4. Compile o custom node

```bash
npm run build
```

### 5. Inicie a infraestrutura com Docker

> **Nota**: Se você estiver no Windows, certifique-se de que o Docker Desktop está executando.

```bash
# Volte para o diretório raiz
cd ..

# Inicie os serviços (use 'docker compose' em versões mais novas do Docker)
docker-compose up -d

# OU se você tem Docker Compose V2:
docker compose up -d
```

### 6. Acesse o n8n

Abra seu navegador e acesse: http://localhost:5678

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin123`

## 🛠️ Desenvolvimento

### Estrutura do Projeto

```
.
├── docker-compose.yml          # Configuração do Docker
├── .env.example               # Exemplo de variáveis de ambiente
├── n8n-custom-random-node/    # Pacote do custom node
│   ├── src/
│   │   ├── nodes/
│   │   │   └── Random/
│   │   │       └── Random.node.ts  # Implementação principal
│   │   └── index.ts           # Ponto de entrada
│   ├── resources/
│   │   └── random.svg         # Ícone do node
│   ├── package.json
│   ├── tsconfig.json
│   └── gulpfile.js
└── README.md
```

### Scripts Disponíveis

```bash
# Compilar o projeto
npm run build

# Modo de desenvolvimento (watch)
npm run dev

# Linting
npm run lint

# Correção automática de lint
npm run lintfix

# Formatação de código
npm run format
```

### Modificando o Custom Node

1. **Edite o código fonte** em `src/nodes/Random/Random.node.ts`
2. **Recompile** com `npm run build`
3. **Reinicie o container** do n8n: `docker-compose restart n8n`

## 🔧 Configuração do n8n

### Variáveis de Ambiente Importantes

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `N8N_BASIC_AUTH_USER` | Usuário de acesso | `admin` |
| `N8N_BASIC_AUTH_PASSWORD` | Senha de acesso | `admin123` |
| `N8N_CUSTOM_EXTENSIONS` | Caminho para nodes customizados | `/home/node/.n8n/custom` |
| `DB_POSTGRESDB_HOST` | Host do PostgreSQL | `postgres` |
| `DB_POSTGRESDB_DATABASE` | Nome do banco | `n8n` |

### Volumes Docker

- **n8n_data**: Dados persistentes do n8n
- **postgres_data**: Dados do banco PostgreSQL
- **Custom nodes**: Mapeamento direto da pasta do projeto

## 📖 Como Usar o Node Random

### 1. Criar um Workflow

1. Acesse o n8n em http://localhost:5678
2. Crie um novo workflow
3. Adicione o node "Random" da seção "Utility"

### 2. Configurar o Node

- **Operation**: "True Random Number Generator"
- **Minimum Value**: Valor mínimo (ex: 1)
- **Maximum Value**: Valor máximo (ex: 100)

### 3. Executar

O node retornará um objeto JSON com:

```json
{
  "randomNumber": 42,
  "min": 1,
  "max": 100,
  "source": "Random.org",
  "timestamp": "2025-09-22T10:30:00.000Z",
  "apiUrl": "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
}
```

## 🔍 Solução de Problemas

### O node não aparece no n8n

1. Verifique se o build foi executado: `npm run build`
2. Confirme que o volume está mapeado corretamente no docker-compose.yml
3. Reinicie o container: `docker-compose restart n8n`
4. Verifique os logs: `docker-compose logs n8n`

### Erro de compilação TypeScript

1. Verifique se o n8n-workflow está instalado: `npm install`
2. Execute o build: `npm run build`
3. Verifique se não há erros de sintaxe

### Erro de conexão com Random.org

1. Verifique sua conexão com a internet
2. Confirme se a API do Random.org está acessível
3. Verifique os logs do node para mais detalhes

### Problemas com PostgreSQL

1. Verifique se a porta 5432 não está em uso
2. Confirme que o container postgres está executando: `docker-compose ps`
3. Verifique os logs: `docker-compose logs postgres`

## 🧪 Testando

### Testar a Compilação

```bash
cd n8n-custom-random-node
npm run build
```

### Testar o Lint

```bash
npm run lint
```

### Testar no n8n

1. Inicie a infraestrutura: `docker-compose up -d`
2. Acesse http://localhost:5678
3. Crie um workflow simples com o node Random
4. Execute o workflow

## 📊 Monitoramento

### Logs do n8n

```bash
docker-compose logs -f n8n
```

### Logs do PostgreSQL

```bash
docker-compose logs -f postgres
```

### Status dos serviços

```bash
docker-compose ps
```

## 🔒 Segurança

### Produção

Para uso em produção, altere:

1. **Credenciais do banco**:
   ```bash
   POSTGRES_PASSWORD=your_secure_password
   DB_POSTGRESDB_PASSWORD=your_secure_password
   ```

2. **Credenciais de acesso**:
   ```bash
   N8N_BASIC_AUTH_USER=your_username
   N8N_BASIC_AUTH_PASSWORD=your_secure_password
   ```

3. **Configure HTTPS** e certificados SSL

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔗 Links Úteis

- [Documentação oficial do n8n](https://docs.n8n.io/)
- [Criando nodes customizados](https://docs.n8n.io/integrations/creating-nodes/)
- [API do Random.org](https://www.random.org/clients/http/)
- [Docker Compose para n8n](https://docs.n8n.io/hosting/installation/docker/)

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique a seção de solução de problemas
2. Consulte os logs dos containers
3. Abra uma issue no GitHub
4. Entre em contato com o desenvolvedor

---

**Desenvolvido por Rafael** 🚀