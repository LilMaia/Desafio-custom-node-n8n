import { IExecuteFunctions } from 'n8n-workflow';
import { BaseRandomOperation } from './BaseRandomOperation';
import { RandomResponseBuilder } from '../builders/RandomResponseBuilder';
import { ErrorHandler, RandomNodeError } from '../errors/ErrorHandler';
import { RANDOM_ORG_LIMITS, API_ENDPOINTS, DEFAULT_VALUES } from '../config/constants';

export class TrueRandomOperation extends BaseRandomOperation {
	protected async generateRandomNumber(
		context: IExecuteFunctions,
		itemIndex: number,
		min: number,
		max: number
	): Promise<number> {
		// Validação específica do Random.org
		if (min < RANDOM_ORG_LIMITS.MIN_VALUE || max > RANDOM_ORG_LIMITS.MAX_VALUE) {
			throw ErrorHandler.createValidationError(
				`Limites de faixa do Random.org excedidos: min (${min}) e max (${max}) devem estar entre ${RANDOM_ORG_LIMITS.MIN_VALUE} e ${RANDOM_ORG_LIMITS.MAX_VALUE}`,
				{ min, max, itemIndex }
			);
		}

		try {
			const randomOrgUrl = this.buildRandomOrgUrl(min, max);

			const response = await context.helpers.request({
				method: 'GET',
				url: randomOrgUrl,
				timeout: DEFAULT_VALUES.TIMEOUT,
			});

			const randomNumber = this.parseRandomOrgResponse(response, itemIndex);
			return randomNumber;
		} catch (error) {
			if (error instanceof RandomNodeError) {
				throw error; // Re-lança nossos erros customizados
			}
			
			// Trata erros de rede/API
			throw ErrorHandler.createNetworkError(
				'Falha ao buscar número aleatório do Random.org',
				error,
				{ itemIndex }
			);
		}
	}

	/**
	 * Constrói a URL da API do Random.org
	 */
	private buildRandomOrgUrl(min: number, max: number): string {
		return `${API_ENDPOINTS.RANDOM_ORG_BASE}?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
	}

	/**
	 * Analisa a resposta da API do Random.org
	 */
	private parseRandomOrgResponse(response: string, itemIndex: number): number {
		const randomNumber = parseInt(response.trim(), 10);

		if (isNaN(randomNumber)) {
			throw ErrorHandler.createParsingError(
				'Resposta inválida da API do Random.org',
				null,
				{ response: response.trim(), itemIndex }
			);
		}

		return randomNumber;
	}

	protected createResponseData(randomNumber: number, min: number, max: number): Record<string, any> {
		// Usando Builder Pattern para construção de resposta complexa
		const responseData = RandomResponseBuilder.create()
			.setResult(randomNumber)
			.setRange(min, max)
			.setPoweredBy('RANDOM.ORG')
			.setType('true-random')
			.setSource('Random.org API')
			.addMetadataField('apiVersion', 'v1')
			.addMetadataField('randomness', 'atmospheric noise')
			.build();

		return responseData as Record<string, any>;
	}
}