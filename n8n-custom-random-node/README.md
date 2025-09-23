# n8n-custom-random-node

A custom n8n node for generating true random numbers using the Random.org API.

## Features

- Generate true random numbers using Random.org
- Configurable minimum and maximum values
- Error handling and validation
- TypeScript implementation
- SVG icon

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Copy the built node to your n8n custom nodes directory

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

## Node Description

The Random node provides a single operation:

### True Random Number Generator

**Parameters:**
- **Minimum Value**: The minimum value for the random number (inclusive)
- **Maximum Value**: The maximum value for the random number (inclusive)

**Output:**
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

## API Integration

This node uses the Random.org HTTP API:
- Endpoint: `https://www.random.org/integers/`
- Method: GET
- Parameters: num, min, max, col, base, format, rnd

## License

MIT