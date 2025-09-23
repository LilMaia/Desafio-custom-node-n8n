import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

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

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'generateNumber') {
					const min = this.getNodeParameter('min', i) as number;
					const max = this.getNodeParameter('max', i) as number;

					// Validate input parameters
					if (min > max) {
						throw new NodeOperationError(
							this.getNode(),
							`Minimum value (${min}) cannot be greater than maximum value (${max})`,
							{ itemIndex: i }
						);
					}

					// Construct Random.org API URL
					const randomOrgUrl = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

					// Make request to Random.org
					const response = await this.helpers.request({
						method: 'GET',
						url: randomOrgUrl,
						timeout: 10000,
					});

					// Parse the response (Random.org returns plain text number)
					const randomNumber = parseInt(response.trim(), 10);

					if (isNaN(randomNumber)) {
						throw new NodeOperationError(
							this.getNode(),
							'Invalid response from Random.org API',
							{ itemIndex: i }
						);
					}

					// Create output data
					const executionData: INodeExecutionData = {
						json: {
							// Resultado principal (destaque)
							result: randomNumber,

							// Informações de contexto
							min: min,
							max: max,
							timestamp: new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC'),

							// Fonte
							poweredBy: 'RANDOM.ORG',
						},
						pairedItem: {
							item: i,
						},
					};

					returnData.push(executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error occurred',
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}