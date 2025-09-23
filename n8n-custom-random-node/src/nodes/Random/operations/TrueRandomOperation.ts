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
				`Random.org range limits exceeded: min (${min}) and max (${max}) must be within -1,000,000,000 to 1,000,000,000`,
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
					'Invalid response from Random.org API',
					null,
					{ response: response.trim(), itemIndex }
				);
			}

			return randomNumber;
		} catch (error) {
			if (error instanceof RandomNodeError) {
				throw error; // Re-throw our custom errors
			}
			
			// Handle network/API errors
			throw ErrorHandler.createNetworkError(
				'Failed to fetch random number from Random.org',
				error,
				{ itemIndex }
			);
		}
	}

	protected createResponseData(randomNumber: number, min: number, max: number): Record<string, any> {
		// Using Builder Pattern for complex response construction
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