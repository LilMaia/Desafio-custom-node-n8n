import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { RANDOM_ORG_LIMITS, API_ENDPOINTS, DEFAULT_VALUES } from '../config/constants';

/**
 * Operação simplificada para geração de números aleatórios usando Random.org
 */
export class RandomOperation {
	/**
	 * Executa a operação de geração de número aleatório
	 */
	async execute(
		context: IExecuteFunctions,
		itemIndex: number,
		min: number,
		max: number
	): Promise<INodeExecutionData> {
		try {
			// Validação única
			this.validateParameters(min, max, itemIndex, context);

			// Gerar número aleatório
			const randomNumber = await this.generateRandomNumber(context, min, max);

			// Criar resposta
			return {
				json: {
					result: randomNumber,
					min: min,
					max: max,
					timestamp: new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC'),
					source: 'Random.org API'
				},
				pairedItem: {
					item: itemIndex,
				},
			};
		} catch (error) {
			if (context.continueOnFail()) {
				return {
					json: {
						error: error instanceof Error ? error.message : 'Erro desconhecido',
					},
					pairedItem: {
						item: itemIndex,
					},
				};
			}
			throw error;
		}
	}

	/**
	 * Valida os parâmetros de entrada
	 */
	private validateParameters(
		min: number,
		max: number,
		itemIndex: number,
		context: IExecuteFunctions
	): void {
		if (typeof min !== 'number' || typeof max !== 'number') {
			throw new NodeOperationError(
				context.getNode(),
				'Valores mínimo e máximo devem ser números válidos',
				{ itemIndex }
			);
		}

		if (min > max) {
			throw new NodeOperationError(
				context.getNode(),
				`Valor mínimo (${min}) não pode ser maior que o valor máximo (${max})`,
				{ itemIndex }
			);
		}

		if (min < RANDOM_ORG_LIMITS.MIN_VALUE || max > RANDOM_ORG_LIMITS.MAX_VALUE) {
			throw new NodeOperationError(
				context.getNode(),
				`Limites de faixa do Random.org excedidos: min (${min}) e max (${max}) devem estar entre ${RANDOM_ORG_LIMITS.MIN_VALUE} e ${RANDOM_ORG_LIMITS.MAX_VALUE}`,
				{ itemIndex }
			);
		}
	}

	/**
	 * Gera número aleatório usando a API do Random.org
	 */
	private async generateRandomNumber(
		context: IExecuteFunctions,
		min: number,
		max: number
	): Promise<number> {
		const url = `${API_ENDPOINTS.RANDOM_ORG_BASE}?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

		try {
			const response = await context.helpers.request({
				method: 'GET',
				url: url,
				timeout: DEFAULT_VALUES.TIMEOUT,
			});

			const randomNumber = parseInt(response.trim(), 10);

			if (isNaN(randomNumber)) {
				throw new Error('Resposta inválida da API do Random.org');
			}

			return randomNumber;
		} catch (error) {
			throw new Error(`Falha ao buscar número aleatório do Random.org: ${error instanceof Error ? error.message : 'erro desconhecido'}`);
		}
	}
}