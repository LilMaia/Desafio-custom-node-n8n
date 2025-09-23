import { INodeProperties } from 'n8n-workflow';
import { OPERATIONS, DEFAULT_VALUES, RANDOM_ORG_LIMITS } from './constants';

/**
 * Definições das propriedades do nó Random
 */
export const nodeProperties: INodeProperties[] = [
	{
		displayName: 'Operação',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'True Random Number Generator',
				value: OPERATIONS.GENERATE_NUMBER,
				description: 'Gera um número verdadeiramente aleatório usando Random.org',
				action: 'Gerar um número verdadeiramente aleatório',
			},
		],
		default: OPERATIONS.GENERATE_NUMBER,
	},
	{
		displayName: 'Valor Mínimo',
		name: 'min',
		type: 'number',
		default: DEFAULT_VALUES.MIN,
		description: 'O valor mínimo para o número aleatório (inclusivo)',
		displayOptions: {
			show: {
				operation: [OPERATIONS.GENERATE_NUMBER],
			},
		},
		typeOptions: {
			minValue: RANDOM_ORG_LIMITS.MIN_VALUE,
			maxValue: RANDOM_ORG_LIMITS.MAX_VALUE,
		},
	},
	{
		displayName: 'Valor Máximo',
		name: 'max',
		type: 'number',
		default: DEFAULT_VALUES.MAX,
		description: 'O valor máximo para o número aleatório (inclusivo)',
		displayOptions: {
			show: {
				operation: [OPERATIONS.GENERATE_NUMBER],
			},
		},
		typeOptions: {
			minValue: RANDOM_ORG_LIMITS.MIN_VALUE,
			maxValue: RANDOM_ORG_LIMITS.MAX_VALUE,
		},
	},
];