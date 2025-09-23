import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { TrueRandomOperation } from './operations/TrueRandomOperation';
import { ErrorHandler } from './errors/ErrorHandler';

export class Random implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random',
		name: 'random',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Gera números verdadeiramente aleatórios usando Random.org',
		defaults: {
			name: 'Random',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operação',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Gerador de Números Verdadeiramente Aleatórios',
						value: 'generateNumber',
						description: 'Gera um número verdadeiramente aleatório usando Random.org',
						action: 'Gerar um número verdadeiramente aleatório',
					},
				],
				default: 'generateNumber',
			},
			{
				displayName: 'Valor Mínimo',
				name: 'min',
				type: 'number',
				default: 1,
				description: 'O valor mínimo para o número aleatório (inclusivo)',
				displayOptions: {
					show: {
						operation: ['generateNumber'],
					},
				},
				typeOptions: {
					minValue: -1000000000,
					maxValue: 1000000000,
				},
			},
			{
				displayName: 'Valor Máximo',
				name: 'max',
				type: 'number',
				default: 100,
				description: 'O valor máximo para o número aleatório (inclusivo)',
				displayOptions: {
					show: {
						operation: ['generateNumber'],
					},
				},
				typeOptions: {
					minValue: -1000000000,
					maxValue: 1000000000,
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Factory para operações (Padrão: Factory)
		const getOperation = (operationType: string) => {
			switch (operationType) {
				case 'generateNumber':
					return new TrueRandomOperation();
				default:
					throw ErrorHandler.createValidationError(`Operação desconhecida: ${operationType}`);
			}
		};

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'generateNumber') {
					const min = this.getNodeParameter('min', i) as number;
					const max = this.getNodeParameter('max', i) as number;

					// Usando Template Method Pattern através da operação
					const randomOperation = getOperation(operation);
					const executionData = await randomOperation.executeOperation(this, i, min, max);
					
					returnData.push(executionData);
				}
			} catch (error) {
				// Usando Error Handler Pattern
				const handledError = ErrorHandler.handleError(error, this.getNode(), i);
				
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: handledError.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw handledError;
			}
		}

		return [returnData];
	}
}