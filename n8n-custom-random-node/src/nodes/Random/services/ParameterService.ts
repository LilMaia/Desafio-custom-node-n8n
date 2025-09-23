import { IExecuteFunctions } from 'n8n-workflow';

/**
 * Serviço simplificado para operações com parâmetros
 */
export class ParameterService {
	/**
	 * Extrai a operação selecionada
	 */
	static getOperation(context: IExecuteFunctions): string {
		return context.getNodeParameter('operation', 0) as string;
	}

	/**
	 * Extrai e valida os valores mínimo e máximo
	 */
	static getValidatedMinMax(context: IExecuteFunctions, itemIndex: number): { min: number; max: number } {
		const min = context.getNodeParameter('min', itemIndex) as number;
		const max = context.getNodeParameter('max', itemIndex) as number;
		
		// Validação básica já é feita aqui
		if (typeof min !== 'number' || typeof max !== 'number') {
			throw new Error('Valores mínimo e máximo devem ser números válidos');
		}

		return { min, max };
	}
}