/**
 * Constantes e configurações do nó Random
 */

// Limites do Random.org
export const RANDOM_ORG_LIMITS = {
	MIN_VALUE: -1000000000,
	MAX_VALUE: 1000000000,
} as const;

// Valores padrão
export const DEFAULT_VALUES = {
	MIN: 1,
	MAX: 100,
	TIMEOUT: 10000,
} as const;

// Operações disponíveis
export const OPERATIONS = {
	GENERATE_NUMBER: 'generateNumber',
} as const;

// Metadados do nó
export const NODE_METADATA = {
	DISPLAY_NAME: 'Random',
	NAME: 'random',
	ICON: 'file:random.svg',
	GROUP: ['transform'],
	VERSION: 1,
	DESCRIPTION: 'Gera números verdadeiramente aleatórios usando Random.org',
} as const;

// URLs da API
export const API_ENDPOINTS = {
	RANDOM_ORG_BASE: 'https://www.random.org/integers/',
} as const;