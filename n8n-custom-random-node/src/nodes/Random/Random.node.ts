import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { TrueRandomOperation } from './operations/TrueRandomOperation';
import { RandomResponseBuilder } from './builders/RandomResponseBuilder';
import { ErrorHandler } from './errors/ErrorHandler';

export class Random implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random',
		name: 'random',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate true random numbers using Random.org',
		defaults: {
			name: 'Random',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'True Random Number Generator',
						value: 'generateNumber',
						description: 'Generate a true random number using Random.org',
						action: 'Generate a true random number',
					},
				],
				default: 'generateNumber',
			},
			{
				displayName: 'Minimum Value',
				name: 'min',
				type: 'number',
				default: 1,
				description: 'The minimum value for the random number (inclusive)',
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
				displayName: 'Maximum Value',
				name: 'max',
				type: 'number',
				default: 100,
				description: 'The maximum value for the random number (inclusive)',
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

		// Factory para operações (Pattern: Factory)
		const getOperation = (operationType: string) => {
			switch (operationType) {
				case 'generateNumber':
					return new TrueRandomOperation();
				default:
					throw ErrorHandler.createValidationError(`Unknown operation: ${operationType}`);
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