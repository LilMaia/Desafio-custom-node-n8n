import { IExecuteFunctions } from 'n8n-workflow';
import { BaseRandomOperation } from './BaseRandomOperation';
import { RandomResponseBuilder } from '../builders/RandomResponseBuilder';
import { ErrorHandler, RandomNodeError } from '../errors/ErrorHandler';

export class TrueRandomOperation extends BaseRandomOperation {
	protected async generateRandomNumber(
		context: IExecuteFunctions,
		itemIndex: number,
		min: number,
		max: number
	): Promise<number> {
		// Validação específica do Random.org
		if (min < -1000000000 || max > 1000000000) {
			throw ErrorHandler.createValidationError(
				`Limites de faixa do Random.org excedidos: min (${min}) e max (${max}) devem estar entre -1.000.000.000 e 1.000.000.000`,
				{ min, max, itemIndex }
			);
		}

		try {
			const randomOrgUrl = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;

			const response = await context.helpers.request({
				method: 'GET',
				url: randomOrgUrl,
				timeout: 10000,
			});

			const randomNumber = parseInt(response.trim(), 10);

			if (isNaN(randomNumber)) {
				throw ErrorHandler.createParsingError(
					'Resposta inválida da API do Random.org',
					null,
					{ response: response.trim(), itemIndex }
				);
			}

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