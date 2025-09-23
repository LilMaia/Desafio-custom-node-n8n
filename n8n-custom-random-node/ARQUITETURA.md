# Arquitetura do Nó Customizado Random para n8n

## Visão Geral

Este projeto implementa um nó customizado para n8n que gera números aleatórios usando a API do Random.org. O código foi estruturado seguindo princípios de design patterns e arquitetura modular para garantir manutenibilidade, legibilidade e extensibilidade.

## Padrões de Design Implementados

### 1. Template Method Pattern
- **Localização**: `BaseOperation.ts`
- **Propósito**: Define a estrutura comum para todas as operações de geração de números aleatórios
- **Benefício**: Permite reutilização de código e padronização do fluxo de execução

### 2. Builder Pattern
- **Localização**: `RandomNumberBuilder.ts`
- **Propósito**: Constrói objetos de resposta de forma flexível e validada
- **Benefício**: Centraliza a validação e criação de objetos de resultado

### 3. Error Handler Pattern
- **Localização**: `ErrorHandler.ts`
- **Propósito**: Gerencia erros de forma consistente em todo o sistema
- **Benefício**: Padroniza o tratamento de erros e melhora a experiência do usuário

## Estrutura Modular

### Diretório `config/`
Centraliza todas as configurações e constantes do projeto:

- **`constants.ts`**: Constantes globais, limites da API Random.org, endpoints
- **`node-properties.ts`**: Definições das propriedades dos campos do nó
- **`node-description.ts`**: Descrição completa do nó para o n8n

### Diretório `services/`
Contém serviços especializados para operações específicas:

- **`NodeServices.ts`**: 
  - `ParameterService`: Extração de parâmetros dos dados de entrada
  - `ValidationService`: Validação de parâmetros e regras de negócio

### Diretório `factories/`
Implementa padrões de criação para objetos complexos:

- **`OperationFactory.ts`**: Cria instâncias das operações baseadas no tipo selecionado

### Diretório `executors/`
Coordena a execução das operações:

- **`NodeExecutor.ts`**: Orquestra todo o fluxo de execução do nó

### Diretório `operations/`
Contém as implementações específicas de cada tipo de operação:

- **`BaseOperation.ts`**: Classe abstrata com Template Method
- **`TrueRandomOperation.ts`**: Implementação para Random.org
- **`PseudoRandomOperation.ts`**: Implementação para Math.random()

### Diretório `builders/`
Implementa padrões Builder para construção de objetos:

- **`RandomNumberBuilder.ts`**: Constrói objetos de resultado validados

### Diretório `handlers/`
Gerencia aspectos transversais como tratamento de erros:

- **`ErrorHandler.ts`**: Centraliza o tratamento de erros

## Fluxo de Execução

1. **Entrada**: O nó recebe dados de entrada do workflow n8n
2. **Extração**: `ParameterService` extrai os parâmetros necessários
3. **Validação**: `ValidationService` valida os parâmetros
4. **Criação**: `OperationFactory` cria a operação apropriada
5. **Execução**: `NodeExecutor` coordena a execução
6. **Operação**: A operação específica (Random.org ou Math.random) é executada
7. **Construção**: `RandomNumberBuilder` constrói o resultado
8. **Retorno**: O resultado é retornado para o workflow

## Benefícios da Arquitetura

### Manutenibilidade
- Código organizado em módulos especializados
- Responsabilidades bem definidas
- Fácil localização de funcionalidades específicas

### Legibilidade
- Nomes descritivos e em português
- Estrutura clara e hierárquica
- Documentação integrada ao código

### Extensibilidade
- Fácil adição de novos tipos de operações
- Estrutura preparada para novos serviços
- Padrões estabelecidos para novas funcionalidades

### Testabilidade
- Módulos isolados facilitam testes unitários
- Dependências claramente definidas
- Lógica de negócio separada da infraestrutura

## Configuração e Execução

### Pré-requisitos
- Node.js 14+
- npm ou yarn

### Instalação
```bash
npm install
```

### Build
```bash
npm run build
```

### Desenvolvimento
```bash
npm run dev
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## Considerações de Performance

- Cache de validações repetitivas
- Reutilização de instâncias quando possível
- Minimização de chamadas à API externa
- Tratamento eficiente de erros

## Segurança

- Validação rigorosa de parâmetros de entrada
- Limitação de valores conforme API Random.org
- Tratamento seguro de erros sem exposição de dados sensíveis
- Sanitização de URLs e parâmetros

## Próximos Passos

1. Implementação de testes unitários
2. Adição de métricas e monitoramento
3. Cache para otimização de performance
4. Documentação de API para desenvolvedores