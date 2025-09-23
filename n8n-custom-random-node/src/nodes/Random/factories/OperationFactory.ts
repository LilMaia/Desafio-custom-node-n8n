import { TrueRandomOperation } from '../operations/TrueRandomOperation';
import { ErrorHandler } from '../errors/ErrorHandler';
import { OPERATIONS } from '../config/constants';
import { BaseRandomOperation } from '../operations/BaseRandomOperation';

/**
 * Factory para criar operações baseadas no tipo
 */
export class OperationFactory {
	/**
	 * Cria uma instância da operação baseada no tipo fornecido
	 */
	static createOperation(operationType: string): BaseRandomOperation {
		switch (operationType) {
			case OPERATIONS.GENERATE_NUMBER:
				return new TrueRandomOperation();
			default:
				throw ErrorHandler.createValidationError(
					`Operação desconhecida: ${operationType}`,
					{ operationType }
				);
		}
	}

	/**
	 * Retorna lista de operações disponíveis
	 */
	static getAvailableOperations(): string[] {
		return Object.values(OPERATIONS);
	}

	/**
	 * Verifica se uma operação é válida
	 */
	static isValidOperation(operationType: string): boolean {
		return Object.values(OPERATIONS).includes(operationType as any);
	}
}