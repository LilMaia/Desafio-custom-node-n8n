import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { RandomOperation } from '../operations/RandomOperation';
import { ParameterService } from '../services/ParameterService';

/**
 * Executor simplificado do nó
 */
export class SimpleExecutor {
	/**
	 * Executa a operação para todos os itens
	 */
	static async execute(context: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = context.getInputData();
		const returnData: INodeExecutionData[] = [];
		const randomOperation = new RandomOperation();

		for (let i = 0; i < items.length; i++) {
			try {
				const { min, max } = ParameterService.getValidatedMinMax(context, i);
				const result = await randomOperation.execute(context, i, min, max);
				returnData.push(result);
			} catch (error) {
				if (context.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Erro desconhecido',
						},
						pairedItem: {
							item: i,
						},
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}