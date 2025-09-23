import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ErrorHandler } from '../errors/ErrorHandler';

/**
 * Serviço para extrair parâmetros do nó
 */
export class ParameterService {
	/**
	 * Extrai a operação selecionada
	 */
	static getOperation(context: IExecuteFunctions): string {
		return context.getNodeParameter('operation', 0) as string;
	}

	/**
	 * Extrai os valores mínimo e máximo para um item específico
	 */
	static getMinMaxValues(context: IExecuteFunctions, itemIndex: number): { min: number; max: number } {
		const min = context.getNodeParameter('min', itemIndex) as number;
		const max = context.getNodeParameter('max', itemIndex) as number;
		return { min, max };
	}
}

/**
 * Serviço para criação de dados de resposta de erro
 */
export class ErrorResponseService {
	/**
	 * Cria dados de execução para casos de erro quando continueOnFail está ativo
	 */
	static createErrorExecutionData(errorMessage: string, itemIndex: number): INodeExecutionData {
		return {
			json: {
				error: errorMessage,
			},
			pairedItem: {
				item: itemIndex,
			},
		};
	}
}

/**
 * Serviço para validação de parâmetros
 */
export class ValidationService {
	/**
	 * Valida se uma operação é suportada
	 */
	static validateOperation(operation: string): void {
		if (!operation) {
			throw ErrorHandler.createValidationError('Operação não especificada');
		}
	}

	/**
	 * Valida se os valores mínimo e máximo são válidos
	 */
	static validateMinMaxValues(min: number, max: number, itemIndex: number): void {
		if (typeof min !== 'number' || typeof max !== 'number') {
			throw ErrorHandler.createValidationError(
				'Valores mínimo e máximo devem ser números válidos',
				{ min, max, itemIndex }
			);
		}

		if (min > max) {
			throw ErrorHandler.createValidationError(
				`Valor mínimo (${min}) não pode ser maior que o valor máximo (${max})`,
				{ min, max, itemIndex }
			);
		}
	}
}