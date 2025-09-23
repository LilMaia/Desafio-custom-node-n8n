import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export abstract class BaseRandomOperation {
	/**
	 * Método template que define a estrutura do algoritmo
	 */
	async executeOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		min: number,
		max: number
	): Promise<INodeExecutionData> {
		try {
			// Passo 1: Validar parâmetros
			this.validateParameters(min, max, itemIndex, context);

			// Passo 2: Gerar número aleatório
			const randomNumber = await this.generateRandomNumber(context, itemIndex, min, max);

			// Passo 3: Criar dados de resposta
			const responseData = this.createResponseData(randomNumber, min, max);

			// Passo 4: Construir dados de execução
			return this.buildExecutionData(responseData, itemIndex);
		} catch (error) {
			return this.handleError(error, itemIndex, context);
		}
	}

	/**
	 * Validar parâmetros de entrada - pode ser sobrescrito por subclasses
	 */
	protected validateParameters(
		min: number,
		max: number,
		itemIndex: number,
		context: IExecuteFunctions
	): void {
		if (min > max) {
			throw new NodeOperationError(
				context.getNode(),
				`Valor mínimo (${min}) não pode ser maior que o valor máximo (${max})`,
				{ itemIndex }
			);
		}
	}

	/**
	 * Método abstrato - deve ser implementado pelas subclasses
	 */
	protected abstract generateRandomNumber(
		context: IExecuteFunctions,
		itemIndex: number,
		min: number,
		max: number
	): Promise<number>;

	/**
	 * Criar dados de resposta - pode ser sobrescrito por subclasses
	 */
	protected createResponseData(randomNumber: number, min: number, max: number): Record<string, any> {
		return {
			result: randomNumber,
			min: min,
			max: max,
			timestamp: new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC'),
		};
	}

	/**
	 * Construir dados de execução - pode ser sobrescrito por subclasses
	 */
	protected buildExecutionData(responseData: Record<string, any>, itemIndex: number): INodeExecutionData {
		return {
			json: responseData,
			pairedItem: {
				item: itemIndex,
			},
		};
	}

	/**
	 * Tratar erros - pode ser sobrescrito por subclasses
	 */
	protected handleError(error: any, itemIndex: number, context: IExecuteFunctions): INodeExecutionData {
		if (context.continueOnFail()) {
			return {
				json: {
					error: error instanceof Error ? error.message : 'Erro desconhecido ocorreu',
				},
				pairedItem: {
					item: itemIndex,
				},
			};
		}
		throw error;
	}
}