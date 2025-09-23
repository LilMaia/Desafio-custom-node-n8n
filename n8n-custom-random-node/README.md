# n8n-custom-random-node

Um nó customizado para n8n que gera números verdadeiramente aleatórios usando a API do Random.org.

## Funcionalidades

- Gera números verdadeiramente aleatórios usando Random.org
- Valores mínimo e máximo configuráveis
- Tratamento de erros e validação
- Implementação em TypeScript
- Ícone SVG personalizado

## Instalação

1. Clone este repositório
2. Execute `npm install`
3. Execute `npm run build`
4. Copie o nó construído para o diretório de nós customizados do n8n

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Construir o projeto
npm run build

# Observar mudanças
npm run dev

# Verificar código
npm run lint

# Formatar código
npm run format
```

## Descrição do Nó

O nó Random fornece uma única operação:

### Gerador de Números Verdadeiramente Aleatórios

**Parâmetros:**
- **Valor Mínimo**: O valor mínimo para o número aleatório (inclusivo)
- **Valor Máximo**: O valor máximo para o número aleatório (inclusivo)

**Saída:**
```json
{
  "result": 42,
  "min": 1,
  "max": 100,
  "timestamp": "2025-09-23 10:30:00 UTC",
  "poweredBy": "RANDOM.ORG",
  "type": "true-random",
  "source": "Random.org API"
}
```

## Integração com API

Este nó usa a API HTTP do Random.org:
- Endpoint: `https://www.random.org/integers/`
- Método: GET
- Parâmetros: num, min, max, col, base, format, rnd

## Licença

MIT