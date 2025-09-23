import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { OperationFactory } from '../factories/OperationFactory';
import { ParameterService, ErrorResponseService, ValidationService } from '../services/NodeServices';
import { ErrorHandler } from '../errors/ErrorHandler';
import { OPERATIONS } from '../config/constants';

/**
 * Executor principal responsável pela lógica de execução do nó
 */
export class NodeExecutor {
	/**
	 * Executa a operação para todos os itens de entrada
	 */
	static async execute(context: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = context.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = ParameterService.getOperation(context);

		// Validação inicial da operação
		ValidationService.validateOperation(operation);

		// Processa cada item
		for (let i = 0; i < items.length; i++) {
			try {
				const executionData = await this.processItem(context, operation, i);
				returnData.push(executionData);
			} catch (error) {
				const errorData = this.handleItemError(context, error, i);
				if (errorData) {
					returnData.push(errorData);
				} else {
					throw error; // Re-lança se não deve continuar
				}
			}
		}

		return [returnData];
	}

	/**
	 * Processa um item individual
	 */
	private static async processItem(
		context: IExecuteFunctions,
		operation: string,
		itemIndex: number
	): Promise<INodeExecutionData> {
		if (operation === OPERATIONS.GENERATE_NUMBER) {
			return await this.processGenerateNumberOperation(context, itemIndex);
		}

		throw ErrorHandler.createValidationError(`Operação não suportada: ${operation}`);
	}

	/**
	 * Processa a operação de geração de números aleatórios
	 */
	private static async processGenerateNumberOperation(
		context: IExecuteFunctions,
		itemIndex: number
	): Promise<INodeExecutionData> {
		// Extrai e valida parâmetros
		const { min, max } = ParameterService.getMinMaxValues(context, itemIndex);
		ValidationService.validateMinMaxValues(min, max, itemIndex);

		// Cria e executa a operação
		const randomOperation = OperationFactory.createOperation(OPERATIONS.GENERATE_NUMBER);
		return await randomOperation.executeOperation(context, itemIndex, min, max);
	}

	/**
	 * Trata erros que ocorrem durante o processamento de um item
	 */
	private static handleItemError(
		context: IExecuteFunctions,
		error: any,
		itemIndex: number
	): INodeExecutionData | null {
		const handledError = ErrorHandler.handleError(error, context.getNode(), itemIndex);

		if (context.continueOnFail()) {
			return ErrorResponseService.createErrorExecutionData(handledError.message, itemIndex);
		}

		// Retorna null para indicar que o erro deve ser re-lançado
		return null;
	}
}